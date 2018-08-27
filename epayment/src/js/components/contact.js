import React from 'react';
import {Link} from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import {ic_phone} from 'react-icons-kit/md/ic_phone';
import {ic_email} from 'react-icons-kit/md/ic_email';
import {ic_person} from 'react-icons-kit/md/ic_person';
import {ic_phone_iphone} from 'react-icons-kit/md/ic_phone_iphone';
import {plane} from 'react-icons-kit/entypo/plane';
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import GoUp from './common/go_up';
import Footer from './common/footer';
import HowToSend from './common/howToSend';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import EmailValidator from 'email-validator'

import {actionWithData} from '../redux/actions'

const initialState = {
  fullname: "", email:"", telephone:"", message:"", submit: false, userStatus: null,
};

import LogoMain from './common/logo'

class Contact extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;

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

    sendMessage(){
        if(this.validator()> 0)return;
        let url = this.props.backEndLinks.enquiry;
        let dataTosend = {
            fullname: this.state.fullname, email: this.state.email, telephone: this.state.telephone, message: this.state.message,
        };
        this.props.actionWithData('post', url, this.state).then(
            res => {
                alert(res.data);
                this.setState(initialState);
            },
            err => {
                this.processError(err)
            }
        )
    }

    validator(){
        if(this.state.fullname.length < 1){
            alert("Full name cannot be empty"); this.setState({submit: null}); return 1
        }
        if(!EmailValidator.validate(this.state.email)){
            alert("Email must be a valid email address"); this.setState({submit: null}); return 1
        }
        if(this.state.telephone.length < 1 ){
            alert("Telephone cannot be empty"); this.setState({submit: null}); return 1
        }
        if(this.state.message.length < 1){
            alert("Message is required"); this.setState({submit: null}); return 1
        }
        return 0
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
            else{
                let errorcontent = '';
                Object.entries(err.response.data).forEach(
                    ([key, value]) => {
                        errorcontent+="* "+key+" - "+value+"\n"
                    }
                );
                alert(errorcontent); this.setState({submit: false});
                console.log(err.response)
            }
        }
    }

    render(){
    return(
        <div className={'wrapper_main'}>
            <GoUp/>
            <div className={'header home'}>
                <LogoMain/>
                <div className={'background'}> </div>
                <div className={'cover-back'}> </div>
                <div className={'navbar-main'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-delay="1000" data-aos-duration="300">
                    <Link to={'/'}><li >Home</li></Link>
                    <Link to={'/about'}><li>About</li></Link>
                    <Link to={'/contact'}><li className={'active'}>Contact</li></Link>
                </div>
                <div className={'content'}>
                    <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="400" data-aos-anchor-placement="top-center">CONTACT ETRANSECUREPAY!</div>
                    <div className={'info'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out" data-aos-delay="400" data-aos-duration="700">
                        We have provided an adequate and secure means to contact us and tell us how we can improve.
                    </div>
                </div>
            </div>
            <div className={'container'}>
                <div className={'contact-us'}>
                    <p>Leave us a message</p>

                    <div className={'contact-form'}  data-aos-once="true" data-aos="zoom-in-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="600">
                        <form>
                            <div className={'form-group'}>
                                <label htmlFor="name">Full Name:</label>
                                <div className={'input-group'}>
                                    <input type="text"
                                        value={this.state.fullname}
                                           onChange={(e) => this.setState({fullname:e.target.value})}
                                    />
                                    <Icon icon={ic_person}/>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="name">Email:</label>
                                <div className={'input-group'}>
                                    <input type="email"
                                           value={this.state.email}
                                           onChange={(e) => this.setState({email:e.target.value})}
                                    />
                                    <Icon icon={ic_email}/>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="name">Telephone:</label>
                                <div className={'input-group'}>
                                    <input type="tel"
                                           value={this.state.telephone}
                                           onChange={(e) => this.setState({telephone:e.target.value})}
                                    />
                                    <Icon icon={ic_phone_iphone}/>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="name">Message:</label>
                                <textarea  cols="30" rows="10" value={this.state.message}
                                           onChange={(e) => this.setState({message:e.target.value})}>

                                </textarea>

                            </div>
                            {
                                    this.state.submit ?
                                        <button type={'button'}>Sending&nbsp;<span className={'loading'}><Icon icon={spinner2}/></span></button>
                                        :
                                        <button type={'button'} onClick={() => [this.setState({submit: true}), this.sendMessage()]}>Send Message&nbsp;<Icon icon={plane}/></button>

                            }
                        </form>
                    </div>
                </div>

            </div>

            <HowToSend/>
            <Footer/>
        </div>
    )
  }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
