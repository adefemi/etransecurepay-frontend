import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Jwt_decode from 'jwt-decode';

import Home from './components/home';
import UserControl from './components/usercontrol';
import AddUser from './components/adduser';
import AdminProfile from './components/adminprofile';
import Login from './components/Login';
import TransactionLog from './components/transactionLog';
import EnquiryList from './components/enquirylist';
import EnquiryMain from './components/enquiryMain';


import Loader from './components/common/loader';

import {actionWithoutData, setContent} from './redux/actions'

class Router extends Component {
    constructor(props) {
        super(props);

        this.getUserContents();
        this.verifyUser();

        this.state = {
            userList : null, userProfile: null, userAccount: null, swiftCode: null, enquiryList: null, errorStatus: false,
        }
    }

    verifyUser(){
        let user = localStorage.getItem('etrans-admin');
        if(user !== null){
            let data = JSON.parse(user);
            let exp = Jwt_decode(data.refresh).exp;
            let currentTime = Math.floor(Date.now() / 1000);
            if(currentTime > exp){
                localStorage.removeItem('etrans-admin');
                this.props.setContent("SET_ADMIN_ACTIVE", false);
            }
            else{
                let parsedData = Jwt_decode(data.access);
                let url = this.props.backEndLinks.users + parsedData.user_id + '/';
                this.props.actionWithoutData('get',url).then(
                    (rem) => {
                        this.props.setContent("SET_ADMIN_ACTIVE", rem.data);
                    },
                    (err) => {
                        this.props.setContent("SET_ADMIN_ACTIVE", false);
                    }
                );
            }

        }
        else{
            this.props.setContent("SET_ADMIN_ACTIVE", false);
        }
     
    }

    getUserContents(){
        let url = this.props.backEndLinks.users;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.userList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({userList: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        url = this.props.backEndLinks.userProfile;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.userProfileList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({userProfile: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        url = this.props.backEndLinks.userAccount;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.userAccountList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({userAccount: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        url = this.props.backEndLinks.swiftCode;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.swiftCodeList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({swiftCode: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        url = this.props.backEndLinks.transaction;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.transactionLogList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({swiftCode: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        url = this.props.backEndLinks.enquiry;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.userContent.enquiryList = res.data;
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({enquiryList: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        )
    }

    render(){
    return(
        this.state.errorStatus ? <h1>Network Error</h1> :
        this.state.userList === null || this.state.userAccount === null || this.state.userProfile === null || this.state.swiftCode === null || this.state.enquiryList === null ? <Loader/> :
            <BrowserRouter>
                <AnimatedSwitch
                    atEnter={{ opacity: 0 }}
                    atLeave={{ opacity: 0 }}
                    atActive={{ opacity: 1 }}
                    className="switch-wrapper"
                >
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/profile" component={AdminProfile} />
                    <Route exact path="/user/new" component={AddUser} />
                    <Route exact path="/user/:username" component={UserControl} />
                    <Route exact path="/transactionlog" component={TransactionLog} />
                    <Route exact path="/enquiries" component={EnquiryList} />
                    <Route exact path="/enquiries/:id" component={EnquiryMain} />
                </AnimatedSwitch>
            </BrowserRouter>
    )
  }
}

function mapStateToProps(state) {
    return({
        adminStatus: state.adminStatus, userContent: state.userContent, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);

