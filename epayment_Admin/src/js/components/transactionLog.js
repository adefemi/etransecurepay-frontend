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
    adminStatus: null, transactionLogList: null, maxperlist: 10, currentPage : 1, totalPages : 1, userList: null,
    showDelete: false, fileToDelete: null, infoContent: "", deleteStatus: false, searchcontent: ""
};

class AdminHome extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
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
        if(props.userContent.hasOwnProperty('transactionLogList')){
            if(props.userContent.transactionLogList !== this.state.transactionLogList){
                this.setState({transactionLogList: props.userContent.transactionLogList});
                this.setState({totalPages: Math.ceil(props.userContent.transactionLogList.length / this.state.maxperlist)})
            }
        }
        if(props.userContent.hasOwnProperty('userList')){
            if(props.userContent.userList !== this.state.userList){
                this.setState({userList: props.userContent.userList});
            }
        }
    }

    transactionList(){
        let _List = [...this.state.transactionLogList].reverse();
        let loader = ((this.state.currentPage * this.state.maxperlist) - this.state.maxperlist);
        let count = _List.length - loader;
        let incrementation = this.state.maxperlist;
        count < this.state.maxperlist ? incrementation = count: null;

        let listCount = incrementation + loader;
        _List.length < listCount ? listCount = _List.length : null;
        let _Loglist = [];
        for(let i = loader; i < listCount; i++){
            let sender = [...this.state.userList].filter(o => o.id === _List[i].user)[0];
            _Loglist.push(
                <ol key={i}>
                    <li>{i+1}</li>
                    <li><Link to={'/user/'+sender.username}>{sender.username}</Link></li>
                    <li>{_List[i].benEmail}</li>
                    <li>{_List[i].amount}</li>
                    <li>{moment.unix(_List[i].created_at).format("MM-DD-YYYY")}</li>
                    <li onClick={() => this.showDelete(_List[i])}><span><Icon icon={bin2}/></span></li>
                </ol>
            );
        }
        return _Loglist
    }

    pageControl(i){
        if(i === "next"){
            this.setState({currentPage:this.state.currentPage+1});
        }
        else if(i === "prev"){
            this.setState({currentPage:this.state.currentPage-1});
        }
        else{
            this.setState({currentPage:i});
        }

        setTimeout(() => {
            if(this.state.currentPage === 1){
                window.location.hash = '';
            }
            else{
                window.location.hash = '#page='+this.state.currentPage;
            }
            $('html, body, div').animate({
                scrollTop: 0
            }, 500);
        }, 100);
    }

    paginationControl(){
        let pagins = [];
        let PageCount = this.state.totalPages;

        PageCount > 5 ? PageCount = 5 : null;

        let startPoint = 1;
        if(this.state.currentPage > 5){
            startPoint = parseInt(this.state.currentPage) - 4;
            PageCount = this.state.currentPage;
        }

        this.state.currentPage < 2 ? pagins.push(<li key={0} className={'disabled'}><Icon icon={ic_keyboard_arrow_left}/></li>)
            :pagins.push(<li key={0} onClick={() => this.pageControl("prev")}><Icon icon={ic_keyboard_arrow_left}/></li>);

        for(let i = startPoint; i<=PageCount; i++){
            this.state.currentPage == i ? pagins.push(<li key={i} className={'active'}>{i}</li>) :
                pagins.push(<li key={i} onClick={() => this.pageControl(i)}>{i}</li>)
        }
        this.state.currentPage == this.state.totalPages ? pagins.push(<li key={PageCount+1} className={'disabled'}><Icon icon={ic_keyboard_arrow_right}/></li>)
            :pagins.push(<li key={PageCount+1} onClick={() => this.pageControl("next")}><Icon icon={ic_keyboard_arrow_right}/></li>);

        return pagins
    }

    changePage(){
        if(window.location.hash === "") {
            this.pageControl(1);
        }
        else {
            let lastHash = window.location.hash.split('=');
            let index = lastHash[lastHash.length - 1];
            index > this.state.totalPages ? index = this.state.totalPages : null;
            this.pageControl(index);
        }
    }

    getHashChange(){
        window.onhashchange = function() {
            this.changePage();
        }.bind(this)
    }

    closeDelete(){
        this.setState({showDelete:false, deleteStatus:false})
    }

    deletFile(access = null){
        this.setState({deleteStatus:true});
        let url = this.props.backEndLinks.transaction+this.state.fileToDelete+"/";
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        this.props.authorizeWithoutData('delete',url, accessToken).then(
            (res) => {
                alert("Transaction log was deleted successfully");
                this.setState({deleteStatus:false, showDelete: false});
                let _userList = [...this.state.transactionLogList];
                this.props.userContent.transactionLogList = _userList.filter(o => o.id !== this.state.fileToDelete);
                this.props.setContent("SET_USER_CONTENT",this.props.userContent);
                this.setState({fileToDelete:null, infoContent: ""});
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
        let infoText = "Delete transaction with reference: "+obj.referenceNum;
        this.setState({showDelete:true, infoContent:infoText, fileToDelete:obj.id})
    }


    render(){
        this.getHashChange();
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
                        <h3>Transaction Log</h3>
                    </div>
                    <div className={'mobile-notification'}>
                        To enjoy the best experience, we advice to use a larger screen!
                    </div>
                    <div className={'userList'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-duration="500">
                        <ul>
                            <li>S/N</li>
                            <li>Sender</li>
                            <li>Recipient</li>
                            <li>Amount</li>
                            <li>Date</li>
                            <li>Action</li>
                        </ul>
                        {
                            this.state.transactionLogList === null || this.state.userList === null ? <h2>Loading</h2> :
                                this.state.transactionLogList.length < 1 ? <h2>No Transaction found!</h2> :
                                    this.transactionList()
                        }

                    </div>
                    <div className={'pagination'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="200" data-aos-duration="500">
                        {this.state.transactionLogList === null ? null :
                            this.state.transactionLogList.length < 1 ? null :
                                this.paginationControl()}
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