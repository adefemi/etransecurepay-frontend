import React from 'react';
import {Icon} from 'react-icons-kit';
import {loop2} from 'react-icons-kit/icomoon/loop2'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import resetToken from './common/resetToken'
import ObjToLower from './common/objToLower'


import Navbar from './common/Navbar'
import Footer from './common/footer'
import DeleteControl from './common/deleteControl'

import {authorizeWithData, setContent} from '../redux/actions'

const initialState = {
    username: "", old_password: "", new_password: "", retypepassword: "", adminActive: null,
    submit: false, type: 1,
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
        if(this.props.adminStatus !== this.state.adminActive){
            this.setState({adminActive: this.props.adminStatus});
            if(!this.props.adminStatus) {
                this.props.history.push('/login')
            }
            else{
                if(!this.props.adminStatus.is_superuser){
                    this.props.history.push('/login')
                }
                this.setState({username: this.props.adminStatus.username})
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
        if(this.validator(this.state.type)> 0)return;
        let userID = this.state.adminActive.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-admin')).access: null;

        let url = this.props.backEndLinks.updatePassword+userID;
        this.state.type === 1 ? url = this.props.backEndLinks.updateAdmin+userID : null;
        let payload = ObjToLower({...this.state});

        this.props.authorizeWithData('patch',url,payload, accessToken).then(
            (res) => {
                localStorage.removeItem('etrans-admin');
                this.props.setContent("SET_ADMIN_ACTIVE", false);
                this.props.history.push('/login')
            },
            (err) => {
                this.processError(err)
            }
        )
    }

    validator(type){
        if(this.state.username.length < 1 && type === 1) {
            alert("Username cannot be empty");
            this.setState({submit: false});
            return 1;
        }
        if(type === 2){
            if(this.state.new_password.length < 1 || this.state.new_password.length < 1 || this.state.new_password.length < 1){
                alert("Password fields cannot be empty");
                this.setState({submit: false});
                return 1;
            }
            if(this.state.new_password !== this.state.retypepassword){
                alert("The new password do not match retype password"); this.setState({submit: false}); return 1
            }
        }

        if(this.state.new_password !== this.state.retypepassword && this.state.new_password.length > 0 || this.state.retypepassword.length < 0){
            alert("The new password do not match retype password"); this.setState({submit: false}); return 1
        }
        return 0
    }

    render(){
        return(
            <div>
                <Navbar history={this.props.history}/>

                <div className={'container'}>
                    <div className={'top-pane'}>
                        <h3>Admin Profile</h3>
                    </div>
                    <div className={'account-control'}>
                        <div className={'account-brief'}>
                            <ul data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                                <li>
                                    <label>Admin Username</label>
                                    <div className={'content'}>
                                        <input type="text" value={this.state.username}
                                               onChange={(e) => this.setState({username: e.target.value})}
                                        />
                                    </div>
                                </li>
                                {
                                    this.state.submit ?
                                        <button className={'updatebutton'}>Updating&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                        :
                                        <button onClick={() => [this.setState({submit: true, type: 1}), setTimeout(() => {this.handSubmit()}, 200)]} className={'updatebutton'}>Update&nbsp;<Icon icon={loop2}/></button>

                                }
                            </ul>

                        </div>
                        <div className={'banking-details'}>
                            <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="200" data-aos-duration="500">
                                <div className={'title'}>PASSWORD VALIDATION</div>
                                <div className={'content'}>
                                    <li>
                                        <label>Old Password</label>
                                        <div className={'content'}>
                                            <input className={'addnew'} type={'password'}  value={this.state.old_password}
                                                   onChange={(e) => this.setState({old_password: e.target.value})}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <label>New Password</label>
                                        <div className={'content'}>
                                            <input className={'addnew'} type={'password'}  value={this.state.new_password}
                                                   onChange={(e) => this.setState({new_password: e.target.value})}
                                            />
                                        </div>
                                    </li>
                                    <li>
                                        <label>Re-enter Password</label>
                                        <div className={'content'}>
                                            <input className={'addnew'} type={'password'}  value={this.state.retypepassword}
                                                   onChange={(e) => this.setState({retypepassword: e.target.value})}
                                            />
                                        </div>
                                    </li>
                                </div>
                                {
                                    this.state.submit ?
                                        <button className={'updatebutton'}>Updating&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                        :
                                        <button onClick={() => [this.setState({submit: true, type:2}),setTimeout(() => {this.handSubmit()}, 200)]} className={'updatebutton'}>Update&nbsp;<Icon icon={loop2}/></button>

                                }
                            </div>
                        </div>
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
        authorizeWithData: authorizeWithData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);