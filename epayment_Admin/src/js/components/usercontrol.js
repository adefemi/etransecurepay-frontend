import React from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'react-icons-kit';
import {loop2} from 'react-icons-kit/icomoon/loop2'
import {bin2} from 'react-icons-kit/icomoon/bin2'
import {eye} from 'react-icons-kit/icomoon/eye'
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import NumberFormat from 'react-number-format'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import {close} from 'react-icons-kit/ionicons/close'
import EmailValidator from 'email-validator'
import resetToken from './common/resetToken'
import ObjToLower from './common/objToLower'
import Loader from './common/loader'


import Navbar from './common/Navbar'
import Footer from './common/footer'
import DeleteControl from './common/deleteControl'

import {authorizeWithData, setContent, authorizeWithoutData} from '../redux/actions'

const initialState = {
    passwordStatus: false, status: true, is_staff: false, submit: false, adminStatus: null, activeUser: null,
    userList: null, userAccountList: null, activeAccount: null, userInfoSet: false, userAccountSet: false,
    showDelete: false, fileToDelete: null, infoContent: "", deleteStatus: false, disableUser: false, swiftCodeList: null,

    first_name: "", username: "", email: "", password: "", account_number: "",
    royaleAVB: "", checkingAVB : "", royalePNB : "" , checkingPNB : "", swiftcode: null, swiftSubmit : false, activeSwift: false,
    activeSwiftID: null,
};

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

class UserControl extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState
    }

    getActiveUser(){
        let _userList = [...this.state.userList];
        let username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeUser = _userList.filter(o => o.user.username.toLowerCase() === username);
        this.state.activeUser = activeUser;
        this.setState({activeUser:activeUser});
        if(activeUser.length < 1) return;
        this.getUserInfo();
    }

    getActiveAccount(){
        let _accountList = [...this.state.userAccountList];
        let username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeAccount = _accountList.filter(o => o.user.username.toLowerCase() === username);
        this.state.activeAccount = activeAccount;
        this.setState({activeAccount:activeAccount});
        if(activeAccount.length < 1) return;
        this.getAccountInfo();
    }

    getUserInfo(){
        let activeUser = [...this.state.activeUser][0];
        this.setState({
            first_name: activeUser.user.first_name,
            username: activeUser.user.username,
            email: activeUser.user.email,
            password: activeUser.secret_key,
            account_number: activeUser.account_number,
            is_staff:activeUser.user.is_staff,
            status: activeUser.status,
            userInfoSet: true
        })
    }

    getAccountInfo(){
        let activeAccount = [...this.state.activeAccount][0];
        this.setState({
            royaleAVB: activeAccount.royaleAVB,
            checkingAVB: activeAccount.checkingAVB,
            royalePNB: activeAccount.royalePNB,
            checkingPNB: activeAccount.checkingPNB,
        })
    }

    componentWillUnmount(){
        this.setState(initialState);
    }
    componentWillMount(){
        if(this.state.userList !== null){
            this.getActiveUser();
        }
        if(this.state.userAccountList !== null){
            this.getActiveAccount();
        }
        if(this.state.swiftCodeList !== null){
            this.getSwiftCode();
        }
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        if(this.props.adminStatus !== this.state.adminStatus){
            this.setState({adminStatus: this.props.adminStatus});
            if(!this.props.adminStatus) {
                this.props.history.push('/login')
            }
        }
        if(!this.state.disableUser){
            if(props.userContent.hasOwnProperty('userProfileList')){
                if(props.userContent.userProfileList !== this.state.userList){
                    this.state.userList = props.userContent.userProfileList;
                    this.setState({userList: props.userContent.userProfileList});

                    this.getActiveUser()
                }
            }
            if(props.userContent.hasOwnProperty('userAccountList')){
                if(props.userContent.userAccountList !== this.state.userAccountList){
                    this.state.userAccountList = props.userContent.userAccountList;
                    this.setState({userAccountList: props.userContent.userAccountList});
                    this.getActiveAccount()
                }
            }
            if(props.userContent.hasOwnProperty('swiftCodeList')){
                if(props.userContent.swiftCodeList !== this.state.swiftCodeList){
                    this.state.swiftCodeList = props.userContent.swiftCodeList;
                    this.setState({swiftCodeList: props.userContent.swiftCodeList});
                    this.getSwiftCode();
                }
            }
        }
    }

    processError(err, type=1){
        if(err.message === "Network Error"){
            setTimeout(() => {
                    alert("etwork error! Check your network and try again!!!"); this.setState({submit: false});
                },
                100);
        }
        else {
            if(err.code === 'ECONNABORTED'){
                alert("Operation timeout! Check your network and try again"); this.setState({submit: false});
            }
            else if(err.response.statusText === "Unauthorized"){
                let newaccess = resetToken(this.props.backEndLinks.refresh);
                type === 1 ? this.handSubmit(newaccess) : type === 2 ? this.deletFile(newaccess) : type===3 ? this.handswiftSubmit(newaccess) : this.removeSwift(newaccess)
            }
            else{
                let errorcontent = '';
                Object.entries(err.response.data).forEach(
                    ([key, value]) => {
                        errorcontent+="* "+value+"\n"
                    }
                );
                alert(errorcontent); this.setState({submit: false});
            }
        }
    }

    handswiftSubmit(access = null){
        if(this.state.swiftcode === null){
            alert("Swiftcode is required"); this.setState({swiftSubmit: false}); return ;
        }
        let userID = this.state.activeUser[0].user.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        let url = this.props.backEndLinks.swiftCode;
        this.state.activeSwift ? url = this.props.backEndLinks.swiftCode+this.state.activeSwiftID+"/": null;
        let payload = {user: userID, code: this.state.swiftcode};
        this.props.authorizeWithData(this.state.activeSwift ? 'patch' : 'post',url,payload, accessToken).then(
            (res) => {
                alert("Swiftcode added successfully");
                if(this.state.activeSwift){
                    this.props.userContent.swiftCodeList = this.props.userContent.swiftCodeList.filter(o => o.id !== this.state.activeSwiftID);
                }

                this.props.userContent.swiftCodeList.push(res.data);
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                this.setState({swiftSubmit:false, activeSwift: true, activeSwiftID: res.data.id});
            },
            (err) => {
                this.setState({swiftSubmit:false});
                this.processError(err, 3)
            }
        )
    }

    removeSwift(access = null){
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        let url = this.props.backEndLinks.swiftCode+this.state.activeSwiftID+"/";
        this.props.authorizeWithoutData('delete', url, accessToken).then(
            res => {
                this.props.userContent.swiftCodeList = this.props.userContent.swiftCodeList.filter(o => o.id !== this.state.activeSwiftID);
                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                alert("Swiftcode removed successfully");
                this.setState({swiftSubmit:false, swiftcode: null, activeSwift: false});
            },
            err => {
                this.setState({swiftSubmit:false});
                this.processError(err, 4)
            }
        )
    }

    handSubmit(access = null){
        if(this.validator()> 0)return;
        let userID = this.state.activeUser[0].user.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        let url = this.props.backEndLinks.users+userID+"/";
        let data = {
            first_name: this.state.first_name, username: this.state.username, email: this.state.email,
            password: this.state.password, account_number: this.state.account_number,
            status: this.state.status, is_staff: this.state.is_staff,
        };
        let payload = ObjToLower(data);

        this.props.authorizeWithData('patch',url,payload, accessToken).then(
            (res) => {
                let users = res.data;
                url = this.props.backEndLinks.userProfile+userID+"/";
                this.props.history.push('/user/'+users.username);
                this.props.authorizeWithData('patch',url,payload, accessToken).then(
                    (res) => {
                        let userProfile = res.data;
                        let dataTosend = {royaleAVB: this.state.royaleAVB, checkingAVB : this.state.checkingAVB,
                            royalePNB : this.state.royalePNB , checkingPNB : this.state.checkingPNB};
                        url = this.props.backEndLinks.userAccount+userID+"/";
                        this.props.authorizeWithData('patch',url,dataTosend, accessToken).then(
                            (res) => {
                                let userAccount = res.data;
                                this.props.userContent.userList = this.props.userContent.userList.filter(o => o.id !== userID);
                                this.props.userContent.userList.push(users);
                                this.props.userContent.userProfileList = this.props.userContent.userProfileList.filter(o => o.user.id !== userID);
                                this.props.userContent.userProfileList.push(userProfile);
                                this.props.userContent.userAccountList = this.props.userContent.userAccountList.filter(o => o.user.id !== userID);
                                this.props.userContent.userAccountList.push(userAccount);

                                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                                alert("User Updated successfully");
                                this.setState({submit:false});
                            },
                            (err) => {
                                this.processError(err)
                            }
                        )
                    },
                    (err) => {
                        this.processError(err)
                    }
                )
            },
            (err) => {
                this.processError(err)
            }
        )
    }

    validator(){
        if(this.state.first_name.length < 1){
            alert("Full name cannot be empty"); this.setState({submit: false}); return 1
        }
        if(this.state.username.length < 1){
            alert("Username cannot be empty"); this.setState({submit: false}); return 1
        }
        if(this.state.email.length < 1){
            alert("Username cannot be empty"); this.setState({submit: false}); return 1
        }
        if(!EmailValidator.validate(this.state.email)){
            alert("Email must be a valid email address"); this.setState({submit: false}); return 1
        }
        if(this.state.password.length < 1){
            alert("A password is required"); this.setState({submit: false}); return 1
        }
        if(this.state.password.length < 6){
            alert("Password length cannot be less than six"); this.setState({submit: false}); return 1
        }
        if(this.state.account_number.length < 1){
            alert("Account Number cannot be empty"); this.setState({submit: false}); return 1
        }
        return 0
    }

    closeDelete(){
        this.setState({showDelete:false, deleteStatus:false})
    }

    deletFile(access = null){
        this.setState({deleteStatus:true});
        let url = this.props.backEndLinks.users+this.state.fileToDelete+"/";
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        this.props.authorizeWithoutData('delete',url, accessToken).then(
            (res) => {
                this.setState({deleteStatus:false, showDelete: false, disableUser: true});
                let _userList = [...this.state.userList];
                this.props.userContent.userProfileList = _userList.filter(o => o.user.id !== this.state.fileToDelete);
                this.props.setContent("SET_USER_CONTENT",this.props.userContent);
                this.setState({fileToDelete:null, infoContent: ""});
                alert("User was deleted successfully");
                this.props.history.push('/')
            },
            (error) => {
                this.setState({deleteStatus:false, showDelete: false});
                this.processError(error, 2)
            }
        )
    }

    showDelete(obj){
        let infoText = "Delete User: "+obj.username;
        this.setState({showDelete:true, infoContent:infoText, fileToDelete:obj.id})
    }

    getSwiftCode(){
        if(this.state.activeUser === null) return;
        let _list = [...this.state.swiftCodeList];
        let userID = this.state.activeUser[0].user.id;

        let activeList = _list.filter(o => o.user === userID);
        if(activeList.length > 0) this.setState({swiftcode: activeList[0].code, activeSwift:true, activeSwiftID: activeList[0].id})
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
                {
                    this.state.activeUser === null ? <Loader/> :
                        this.state.activeUser.length < 1 ?<div className={'container'}> <h2>This user do not exist or has been removed</h2></div> :
                            <div className={'container'}>
                                <div className={'top-pane'}>
                                    <h3>Users Control</h3>
                                    <button className={'remove'} onClick={() => this.showDelete(this.state.activeUser[0].user)}>Remove User&nbsp;<Icon icon={bin2}/></button>
                                </div>
                                <div className={'account-control'}>
                                    <div className={'account-brief'}>
                                        <h3>Account Details</h3>

                                        <ul data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                                            <li>
                                                <label>Account Name</label>
                                                <div className={'content'}>
                                                    <input style={{"textTransform":"capitalize"}} type="text" value={this.state.first_name}
                                                           onChange={(e) => this.setState({first_name: e.target.value})}
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <label>Username</label>
                                                <div className={'content'}>
                                                    <input type="text" value={this.state.username}
                                                           onChange={(e) => this.setState({username: e.target.value})}
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <label>Email</label>
                                                <div className={'content'}>
                                                    <input type="email" value={this.state.email}
                                                           onChange={(e) => this.setState({email: e.target.value})}
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <label>Password</label>
                                                <div className={'content'}>
                                                    <input type={this.state.passwordStatus ? "text" : "password"} value={this.state.password}
                                                           onChange={(e) => this.setState({password: e.target.value})}
                                                    />
                                                    {
                                                        this.state.passwordStatus ?
                                                            <Icon onClick={() => this.setState({passwordStatus: false})} icon={eyeBlocked}/> :
                                                            <Icon onClick={() => this.setState({passwordStatus: true})} icon={eye}/>
                                                    }
                                                </div>
                                            </li>
                                            <li>
                                                <label>Account Number</label>
                                                <div className={'content'}>
                                                    <input type="number" value={this.state.account_number}
                                                           onChange={(e) => this.setState({account_number: e.target.value})}
                                                    />
                                                </div>
                                            </li>

                                            {
                                                this.props.adminStatus && this.props.adminStatus.is_superuser ? <li>
                                                        <label>Authorization</label>
                                                        <div className={'content'}>
                                                            <button onClick={() => this.setState({is_staff: !this.state.is_staff})} className={'but-status'}> </button> {
                                                            this.state.is_staff ? "Staff" : "Not Staff"
                                                        }
                                                        </div>
                                                    </li>
                                                    :
                                                    null
                                            }

                                            <li>
                                                <label>Account Status</label>
                                                <div className={'content'}>
                                                    <button onClick={() => this.setState({status: !this.state.status})} className={this.state.status ? 'but-status' : 'but-status inactive'}> </button> {
                                                    this.state.status ? "Active" : "Inactive"
                                                }
                                                </div>
                                            </li>
                                        </ul>

                                    </div>
                                    <div className={'banking-details'}>
                                        <h3>Online Account Statement</h3>
                                        <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="200" data-aos-duration="500">
                                            <div className={'title'}>CHECKING ACCOUNT</div>
                                            <div className={'content'}>
                                                <li>

                                                    <label>Available Balance:</label>
                                                    <div className={'detail'}>
                                                        <NumberFormat
                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                                            value={this.state.checkingAVB}
                                                            onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({checkingAVB: value})
                                                            }}
                                                            placeholder={"0.00"}
                                                        />
                                                    </div>
                                                </li>
                                                <li>
                                                    <label>Pending Balance:</label>
                                                    <div className={'detail'}>
                                                        <NumberFormat
                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                                            value={this.state.checkingPNB}
                                                            onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({checkingPNB: value})
                                                            }}
                                                            placeholder={"0.00"}
                                                        />
                                                    </div>
                                                </li>
                                            </div>
                                        </div>
                                        <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="300" data-aos-duration="500">
                                            <div className={'title'}>ROYALE CHECKING ACCOUNT</div>
                                            <div className={'content'}>
                                                <li>
                                                    <label>Available Balance:</label>
                                                    <div className={'detail'}>
                                                        <NumberFormat
                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                                            value={this.state.royaleAVB}
                                                            onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({royaleAVB: value})
                                                            }}
                                                            placeholder={"0.00"}
                                                        />
                                                    </div>
                                                </li>
                                                <li>
                                                    <label>Pending Balance:</label>
                                                    <div className={'detail'}>
                                                        <NumberFormat
                                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                                            value={this.state.royalePNB}
                                                            onValueChange={(values) => {
                                                                const {formattedValue, value} = values;
                                                                this.setState({royalePNB: value})
                                                            }}
                                                            placeholder={"0.00"}
                                                        />
                                                    </div>
                                                </li>
                                            </div>
                                        </div>
                                        <h3>Swift Verification Code</h3>
                                        <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="200" data-aos-duration="500">
                                            <div className={'title'}>Swift Code</div>
                                            <div className={'content'}>
                                                <li>
                                                    {
                                                        this.state.swiftCodeList === null ? <h2>Loading</h2> :
                                                            <div className={'swift-content'}>
                                                                <input type="text" value={this.state.swiftcode === null ? "Not Available" : this.state.swiftcode} disabled={true} />
                                                                <button onClick={() => this.setState({swiftcode: randomString(7)})}>Generate</button>
                                                            </div>
                                                    }
                                                    <div className={'swift-control'}>
                                                        {
                                                            this.state.swiftCodeList === null ? <span className={'loading'}><Icon icon={spinner2}/></span> :
                                                                this.state.swiftSubmit ?
                                                                    <button className={'updatebutton'}>Updating&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                                                    :
                                                                    <button onClick={() => [this.setState({swiftSubmit: true}), this.handswiftSubmit()]} className={'updatebutton'}>Update&nbsp;<Icon icon={loop2}/></button>

                                                        }
                                                        {
                                                            !this.state.activeSwift ? null :
                                                                this.state.swiftSubmit ?
                                                                    <button className={'updatebutton remove'}>Removing&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                                                    :
                                                                    <button onClick={() => [this.setState({swiftSubmit: true}), this.removeSwift()]} className={'updatebutton remove'}>Remove&nbsp;<Icon icon={close}/></button>

                                                        }
                                                    </div>
                                                </li>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.submit ?
                                        <button className={'updatebutton'}>Updating&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                        :
                                        <button onClick={() => [this.setState({submit: true}), this.handSubmit()]} className={'updatebutton'}>Update&nbsp;<Icon icon={loop2}/></button>

                                }
                            </div>
                }

                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        adminStatus: state.adminStatus, backEndLinks: state.backEndLinks, userContent: state.userContent
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        authorizeWithData: authorizeWithData, setContent: setContent, authorizeWithoutData: authorizeWithoutData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);