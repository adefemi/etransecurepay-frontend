import React from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'react-icons-kit';
import {eye} from 'react-icons-kit/icomoon/eye'
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked'
import {checkmark} from 'react-icons-kit/icomoon/checkmark'
import NumberFormat from 'react-number-format'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import EmailValidator from 'email-validator'
import resetToken from './common/resetToken'
import ObjToLower from './common/objToLower'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';


import Navbar from './common/Navbar'
import Footer from './common/footer'

import {authorizeWithData, setContent} from '../redux/actions'

const initialState = {
    passwordStatus: false, status: true, is_staff: false, submit: false, adminStatus: null,

    first_name: "", username: "", email: "", password: "", account_number: "",
    royaleAVB: "", checkingAVB : "", royalePNB : "" , checkingPNB : "",
};

class UserControl extends React.Component{
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
    }

    processError(err){
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
                this.handSubmit(newaccess);
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


    handSubmit(access = null){
        if(this.validator()> 0)return;

        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;
        let url = this.props.backEndLinks.users;
        let payload = ObjToLower({...this.state});

        this.props.authorizeWithData('post',url,payload, accessToken).then(
            (res) => {
                let users = res.data;
                url = this.props.backEndLinks.userProfile+users.id+"/";
                this.props.authorizeWithData('patch',url,payload, accessToken).then(
                    (res) => {
                        let userProfile = res.data;
                        let royaleAVB= 0.0, checkingAVB = 0.0, royalePNB =0.0 , checkingPNB = 0.0;
                        this.state.royaleAVB.length > 0 ? royaleAVB = this.state.royaleAVB : null;
                        this.state.checkingAVB.length > 0 ? checkingAVB = this.state.checkingAVB : null;
                        this.state.royalePNB.length > 0 ? royalePNB = this.state.royalePNB : null;
                        this.state.checkingPNB.length > 0 ? checkingPNB = this.state.checkingPNB : null;

                        let dataTosend = {royaleAVB: royaleAVB, checkingAVB : checkingAVB, royalePNB : royalePNB , checkingPNB : checkingPNB};
                        url = this.props.backEndLinks.userAccount+users.id+"/";
                        this.props.authorizeWithData('patch',url,dataTosend, accessToken).then(
                            (res) => {
                                let userAccount = res.data;
                                this.props.userContent.userList.push(users);
                                this.props.userContent.userProfileList.push(userProfile);
                                this.props.userContent.userAccountList.push(userAccount);

                                this.props.setContent("SET_USER_CONTENT", this.props.userContent);
                                alert("User added successfully");
                                this.setState(initialState);
                                this.componentWillMount();
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
    render(){
        return(
            <div>
                <Navbar history={this.props.history}/>
                <div className={'container'}>
                    <div className={'top-pane'}>
                        <h3>Add New User</h3>
                    </div>
                    <div className={'account-control'}>
                        <div className={'account-brief'}>
                            <h3>Account Details</h3>
                            <ul data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                                <li>
                                    <label>Account Name</label>
                                    <div className={'content'}>
                                        <input
                                            value={this.state.first_name}
                                            onChange={(e) => this.setState({first_name:e.target.value})}
                                            className={'addnew'} type="text" placeholder={'User fullname'}/>
                                    </div>
                                </li>
                                <li>
                                    <label>Username</label>
                                    <div className={'content'}>
                                        <input
                                            value={this.state.username}
                                            onChange={(e) => this.setState({username:e.target.value})}
                                            className={'addnew'} type="text" placeholder={'Username'}/>
                                    </div>
                                </li>
                                <li>
                                    <label>Email</label>
                                    <div className={'content'}>
                                        <input
                                            value={this.state.email}
                                            onChange={(e) => this.setState({email:e.target.value})}
                                            className={'addnew'} type="email" placeholder={'User email'}/>
                                    </div>
                                </li>
                                <li>
                                    <label>Password</label>
                                    <div className={'content'}>
                                        <input
                                            value={this.state.password}
                                            onChange={(e) => this.setState({password:e.target.value})}
                                            className={'addnew'} type={this.state.passwordStatus ? "text" : "password"} placeholder={'User password'}/>
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
                                        <input
                                            value={this.state.account_number}
                                            onChange={(e) => this.setState({account_number:e.target.value})}
                                            className={'addnew'} type="number" placeholder={'User account number'}/>
                                    </div>
                                </li>
                                {
                                    this.props.adminStatus && this.props.adminStatus.is_superuser ? <li>
                                        <label>Authorization</label>
                                        <div className={'content'}>
                                            <button onClick={() => this.setState({is_staff: !this.state.is_staff})} className={'but-status'}> </button>
                                            {
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
                                                className={'addnew'} placeholder={"0.00"}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <label>Pending Balance:</label>
                                        <NumberFormat
                                            thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                            value={this.state.checkingPNB}
                                            onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                                                this.setState({checkingPNB: value})
                                            }}
                                            className={'addnew'} placeholder={"0.00"}
                                        />
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
                                                className={'addnew'} placeholder={"0.00"}
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
                                                className={'addnew'} placeholder={"0.00"}
                                            />
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.submit ?
                            <button className={'updatebutton'}>Adding&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                            :
                            <button onClick={() => [this.setState({submit: true}), this.handSubmit()]} className={'updatebutton'}>Submit&nbsp;<Icon icon={checkmark}/></button>

                    }

                </div>
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
        authorizeWithData: authorizeWithData, setContent: setContent
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);