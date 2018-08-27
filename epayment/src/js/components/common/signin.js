import React from 'react';
import proptypes from 'prop-types'
import { Icon } from 'react-icons-kit';
import {ic_person} from 'react-icons-kit/md/ic_person';
import {ic_https} from 'react-icons-kit/md/ic_https';
import {ic_settings_power} from 'react-icons-kit/md/ic_settings_power';
import {ic_clear} from 'react-icons-kit/md/ic_clear'
import {login} from 'react-icons-kit/iconic/login';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import Jwt_decode from 'jwt-decode';
import {spinner2} from 'react-icons-kit/icomoon/spinner2'

import {actionWithData, actionWithoutData, setContent} from '../../redux/actions'

const initialState = {
    passwordStatus: false, status: true, userStatus: null, username: "", password: "", submit: false
};



class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        if(this.props.userStatus !== this.state.userStatus){
            this.setState({userStatus: this.props.userStatus});
            if(this.props.userStatus) {
                this.props.history.push('/account')
            }
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.setState({submit: true});
        if(this.validator() < 1)return;
        let payload = {username: this.state.username, password: this.state.password};
        let url = this.props.backEndLinks.auth;
        this.props.actionWithData('post', url, payload).then(
            (res) => {
                let parsedData = Jwt_decode(res.data.access);
                url = this.props.backEndLinks.users + parsedData.user_id + '/';
                this.props.actionWithoutData('get',url).then(
                    (rem) => {
                        if(!rem.data.is_superuser){
                            localStorage.setItem('etrans-user', JSON.stringify(res.data));
                            this.props.setContent("SET_USER_ACTIVE", rem.data);
                            this.props.history.push('/account');
                        }
                        else{
                            alert('invalid username or password');
                            this.setState({submit: false});
                        }
                    },
                    (err) => {
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

    validator(){
        if(this.state.username === "" || this.state.password === ""){
            alert('input field cannot be empty!');
            this.setState({submit: false});
            return 0;
        }
        return 1
    }

    render(){
        return(
            <div className={'content-sign'} data-aos-once="true" data-aos="fade-left" data-aos-easing="ease-out-back" data-aos-delay="400" data-aos-duration="1000">
                <h3>Login to Account</h3>
                <form className={'sign-in-form'} onSubmit={(e) => this.handleSubmit(e)}>
                    <div className={'sign-input-group'}>
                        <input type="text" placeholder={' '}
                            value={this.state.username}
                               onChange={(e) => this.setState({username: e.target.value})}
                        />
                        <label htmlFor="username">Username</label>
                        <Icon icon={ic_person}/>
                    </div>
                    <div className={'sign-input-group'}>
                        <input type="password" placeholder={' '}
                               value={this.state.password}
                               onChange={(e) => this.setState({password: e.target.value})}
                        />
                        <label htmlFor="username">Password</label>
                        <Icon icon={ic_https}/>
                    </div>
                    {
                        this.state.submit ? <button type={'button'} className={'loading'}>Logging In &nbsp; <Icon icon={spinner2}/></button> :
                            <button>Login</button>
                    }

                </form>

            </div>
        )
    }
}

SignIn.propTypes = {
    history: proptypes.object.isRequired,
};
function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, setContent: setContent,actionWithoutData: actionWithoutData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);