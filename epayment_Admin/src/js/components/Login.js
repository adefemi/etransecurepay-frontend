import React from 'react';
import {Icon} from 'react-icons-kit';
import {login} from 'react-icons-kit/iconic/login';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Jwt_decode from 'jwt-decode';
import {spinner2} from 'react-icons-kit/icomoon/spinner2'

import {actionWithData, actionWithoutData, setContent} from '../redux/actions'

class LoginPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            passwordStatus: false, status: true, adminStatus: null, username: "", password: "", submit: false
        }
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        if(this.props.adminStatus !== this.state.adminStatus){
            this.setState({adminStatus: this.props.adminStatus});
            if(this.props.adminStatus) {
                this.props.history.push('/')
            }
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({submit: true});
        let payload = {username: this.state.username, password: this.state.password};
        let url = this.props.backEndLinks.auth;
        this.props.actionWithData('post', url, payload).then(
            (res) => {
                let parsedData = Jwt_decode(res.data.access);
                url = this.props.backEndLinks.users + parsedData.user_id + '/';
                this.props.actionWithoutData('get',url).then(
                    (rem) => {
                        if(rem.data.is_superuser || rem.data.is_staff){
                            localStorage.setItem('etrans-admin', JSON.stringify(res.data));
                            this.props.setContent("SET_ADMIN_ACTIVE", rem.data);
                            this.props.history.push('/');
                        }
                        else{
                            alert('invalid username or password');
                            this.setState({submit: false});
                        }
                    },
                    (err) => {
                        console.log(err.response);
                        alert('invalid username or password');
                        this.setState({submit: false});
                    }
                );
            },
            (err) => {
                alert('invalid username or password');
                this.setState({submit: false});
            }
        )
    }

    render(){
        return(
            <div className={'login-container'}>
                <form className={'login-form'} onSubmit={(e) => this.handleSubmit(e)}>
                    <ul data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                        <div className={'title'}>Admin Authentication</div>
                        <li>
                            <label>Username</label>
                            <div className={'content'}>
                                <input className={'addnew'} value={this.state.username} onChange={(e) => this.setState({username:e.target.value})} type="text"/>
                            </div>
                        </li>
                        <li>
                            <label>Password</label>
                            <div className={'content'}>
                                <input className={'addnew'} value={this.state.password} onChange={(e) => this.setState({password:e.target.value})} type="password"/>
                            </div>
                        </li>


                        {
                            this.state.submit ? <button type={'button'} className={'updatebutton loading'}>Signing In &nbsp; <Icon icon={spinner2}/></button> :
                                <button className={'updatebutton'}>Sign In &nbsp; <Icon icon={login}/></button>
                        }

                    </ul>

                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        adminStatus: state.adminStatus, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, setContent: setContent,actionWithoutData: actionWithoutData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);