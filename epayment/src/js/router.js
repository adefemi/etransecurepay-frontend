import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Jwt_decode from 'jwt-decode';

import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import Account from './components/account';

import Loader from './components/common/loader'
import {actionWithoutData, setContent} from './redux/actions'

class Router extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userProfile: null, userAccount: null, swiftcode: null, errorStatus: false, userStatus: null
        }
    }

    componentWillMount(){
        let user = localStorage.getItem('etrans-user');

        if(user !== null){
            let data = JSON.parse(user);
            let exp = Jwt_decode(data.refresh).exp;
            let currentTime = Math.floor(Date.now() / 1000);
            if(currentTime > exp){
                localStorage.removeItem('etrans-user');
                this.props.setContent("SET_USER_ACTIVE", false);
                this.setState({userStatus: false})
            }
            else{
                let parsedData = Jwt_decode(data.access);
                let url = this.props.backEndLinks.users + parsedData.user_id + '/';
                this.props.actionWithoutData('get',url).then(
                    (rem) => {
                        this.props.setContent("SET_USER_ACTIVE", rem.data);
                        this.setState({userStatus: rem.data})
                    },
                    (err) => {
                        this.props.setContent("SET_USER_ACTIVE", false);
                        this.setState({userStatus: false})
                    }
                );
            }

        }
        else{
            this.props.setContent("SET_USER_ACTIVE", false);
            this.setState({userStatus: false})
        }
        this.getUserContents();
    }

    getUserContents(){
        let url = this.props.backEndLinks.userProfile;
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
                this.setState({swiftcode: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        )
    }
  render(){
    return(
        this.state.errorStatus ? <h2>Network Error!!!</h2> :
            this.state.userAccount === null || this.state.userProfile === null || this.state.swiftcode === null ? <Loader/>:
            <BrowserRouter>
                <AnimatedSwitch
                    atEnter={{ opacity: 0 }}
                    atLeave={{ opacity: 0 }}
                    atActive={{ opacity: 1 }}
                    className="switch-wrapper"
                >
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/contact" component={Contact} />
                    <Route exact path="/account" component={Account} />
                </AnimatedSwitch>
            </BrowserRouter>
    )
  }
}
function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, userContent: state.userContent, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
