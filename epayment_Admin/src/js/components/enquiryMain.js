import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {Icon} from 'react-icons-kit';
import {ic_person_add} from 'react-icons-kit/md/ic_person_add'
import {glass} from 'react-icons-kit/iconic/glass'
import {bin2} from 'react-icons-kit/icomoon/bin2'
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right'
import {ic_keyboard_arrow_left} from 'react-icons-kit/md/ic_keyboard_arrow_left'


import Navbar from './common/Navbar'
import Footer from './common/footer'
import moment from 'moment'
import DeleteControl from './common/deleteControl'
import resetToken from './common/resetToken'

import AOS from 'aos';
// ..
AOS.init();

import {actionWithoutData, authorizeWithoutData, setContent} from '../redux/actions'

const initialState = {
    adminStatus: null, enquiryList: null, maxperlist: 10, currentPage : 1, totalPages : 1, activeEnquiry: null,
    showDelete: false, fileToDelete: null, infoContent: "", deleteStatus: false, searchcontent: ""
};

class AdminHome extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getActiveEnquiry(){
        let _enquiryList = [...this.state.enquiryList];
        let queryid = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeEnquiry = _enquiryList.filter(o => o.created_at+o.id.toString() === queryid);
        this.state.activeEnquiry = activeEnquiry;
        this.setState({activeEnquiry:activeEnquiry});
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        if(this.props.adminStatus !== this.state.adminStatus){
            this.setState({adminStatus: this.props.adminStatus});
            if(!this.props.adminStatus) {
                this.props.history.push('/login')
            }
        }
        if(props.userContent.hasOwnProperty('enquiryList')){
            if(props.userContent.enquiryList !== this.state.enquiryList){
                this.state.enquiryList = props.userContent.enquiryList;
                this.setState({enquiryList: props.userContent.enquiryList});
                this.getActiveEnquiry();
            }
        }
    }

    enquiryList(){
        let _List = [...this.state.enquiryList].reverse();
        let loader = ((this.state.currentPage * this.state.maxperlist) - this.state.maxperlist);
        let count = _List.length - loader;
        let incrementation = this.state.maxperlist;
        count < this.state.maxperlist ? incrementation = count: null;

        let listCount = incrementation + loader;
        _List.length < listCount ? listCount = _List.length : null;
        let _Loglist = [];
        for(let i = loader; i < listCount; i++){
            _Loglist.push(
                <ol key={i}>
                    <li>{i+1}</li>
                    <li>{_List[i].fullname}</li>
                    <li><Link to={'/enquiries/'+_List[i].created_at+_List[i].id.toString()}>
                        {_List[i].message.substring(0, 60)}
                        {_List[i].message.length > 60 ? "..." : null}
                    </Link></li>
                    <li>{moment.unix(_List[i].created_at).format("MM-DD-YYYY")}</li>
                    <li onClick={() => this.showDelete(_List[i])}><span><Icon icon={bin2}/></span></li>
                </ol>
            );
        }
        return _Loglist
    }



    closeDelete(){
        this.setState({showDelete:false, deleteStatus:false})
    }

    deletFile(access = null){
        this.setState({deleteStatus:true});
        let url = this.props.backEndLinks.enquiry+this.state.fileToDelete+"/";
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        this.props.authorizeWithoutData('delete',url, accessToken).then(
            (res) => {
                alert("Enquiry was removed successfully");
                this.setState({deleteStatus:false, showDelete: false});
                let _userList = [...this.state.enquiryList];
                this.props.userContent.enquiryList = _userList.filter(o => o.id !== this.state.fileToDelete);
                this.props.setContent("SET_USER_CONTENT",this.props.userContent);
                this.setState({fileToDelete:null, infoContent: ""});
                this.props.history.push('/enquiries')
            },
            (error) => {
                this.setState({deleteStatus:false, showDelete: false});
                this.processError(error)
            }
        )
    }

    processError(err){
        if(err.message === "Network Error"){
            setTimeout(() => {
                    alert("Network error! Check your network and try again!!!")
                },
                100);
        }
        else {
            if(err.code === 'ECONNABORTED'){
                alert("Operation timeout! Check your network and try again");
            }
            else if(err.response.statusText === "Unauthorized"){
                let newaccess = resetToken(this.props.backEndLinks.refresh);
                this.deletFile(newaccess);
            }
            else{
                let errorcontent = '';
                Object.entries(err.response.data).forEach(
                    ([key, value]) => {
                        errorcontent+="* "+value+"\n";
                    }
                );
                alert(errorcontent);
            }
        }
    }

    showDelete(obj){
        let infoText = "Delete transaction with email: "+obj.email;
        this.setState({showDelete:true, infoContent:infoText, fileToDelete:obj.id})
    }


    render(){
        return(
            <div>
                <Navbar history={this.props.history}/>
                {
                    this.state.showDelete ? <DeleteControl
                        deleteFunction={this.deletFile.bind(this)}
                        deleteStatus={this.state.deleteStatus}
                        infoContent={this.state.infoContent}
                        closeDelete={this.closeDelete.bind(this)}
                    /> : null
                }
                <div className={'container'}>
                    <div className={'top-pane'}>
                        <h3>Enquiry</h3>
                        {
                            this.state.activeEnquiry === null ? null :
                                this.state.activeEnquiry.length < 1 ? null :
                                    <button className={'remove'} onClick={() => this.showDelete(this.state.activeEnquiry[0])}>Remove Enquiry&nbsp;<Icon icon={bin2}/></button>
                        }

                    </div>
                    <div className={'userList'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-duration="500">

                        {
                            this.state.activeEnquiry === null ? <h4>Loading</h4> :
                                this.state.activeEnquiry.length < 1 ? <h4>Ops!, this enquiry is not found...</h4>:
                                    <div style={{"padding":"0 20px"}}>
                                        <h3>Full Name:</h3>
                                        <p>{this.state.activeEnquiry[0].fullname}</p><br/>

                                        <h3>Email:</h3>
                                        <p><a href={"mailto:"+this.state.activeEnquiry[0].email}>{this.state.activeEnquiry[0].email}</a></p><br/>

                                        <h3>Telephone:</h3>
                                        <p>{this.state.activeEnquiry[0].telephone}</p><br/>

                                        <h3>Message:</h3>
                                        <p>{this.state.activeEnquiry[0].message}</p>
                                    </div>
                        }

                    </div>
                </div>
                <Footer/>
            </div>

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
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithoutData: authorizeWithoutData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);