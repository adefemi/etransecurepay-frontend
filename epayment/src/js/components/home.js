import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import { Icon } from 'react-icons-kit';
import {checkSquare} from 'react-icons-kit/feather/checkSquare';
import {basic_paperplane} from 'react-icons-kit/linea/basic_paperplane';
import {basic_settings} from 'react-icons-kit/linea/basic_settings';
import {basic_printer} from 'react-icons-kit/linea/basic_printer';



import GoUp from './common/go_up';
import Footer from './common/footer';
import SignIn from './common/signin';
import HowToSend from './common/howToSend';

import AOS from 'aos';
// ..
AOS.init();

import {actionWithoutData, authorizeWithoutData, setContent} from '../redux/actions'
import MainImage from '../../assets/images/etransecure.jpg'
import LogoMain from './common/logo'

const initialState = {
    signInActive: false, userStatus: null,
};

class Home extends React.Component {
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

    SignInControl(val){
        this.setState({signInActive:val});
    }

    render(){
    return(
     <div>
         <GoUp/>
         <div className={'header'}>
             <div className={'background'}> </div>
             <div className={'cover-back'}> </div>
             <div className={'navbar-main'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-delay="1000" data-aos-duration="300">
                 <Link to={'/'}><li className={'active'}>Home</li></Link>
                 <Link to={'/about'}><li>About</li></Link>
                 <Link to={'/contact'}><li>Contact</li></Link>
             </div>
             <div className={'content'}>
                 <div className={'content-content'}>
                     <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="400" data-aos-anchor-placement="top-center">WELCOME TO ETRANSECUREPAY!</div>
                     <div className={'info'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out" data-aos-delay="400" data-aos-duration="700">
                         Where your money remittance is handled with top-notch efficiency
                     </div>
                 </div>
                 <SignIn

                     history={this.props.history}/>
             </div>
             <LogoMain/>
         </div>
         <div className={'container'}>
             <div className={'item-service'}>
                 <span className={'title'}>Services</span>
                 <div className={'service-list'}>
                     <div className={'service-card'} data-aos-once="true" data-aos="zoom-in-right" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-delay="100">
                         <div><Icon size={100} icon={basic_paperplane}/></div>
                         <div className={'card-title'}>Send Money</div>
                         <div className={'card-content'}>We provide an avenue for sending money with ease and convenience...</div>
                     </div>
                     <div className={'service-card'} data-aos-once="true" data-aos="zoom-out-up" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-delay="300">
                         <div><Icon size={100} icon={basic_settings}/></div>
                         <div className={'card-title'}>Manage Account</div>
                         <div className={'card-content'}>We equip you with a very intuitive account management portal, allowing you to effectively and efficiently manage all you accounts...</div>
                     </div>
                     <div className={'service-card'} data-aos-once="true" data-aos="zoom-in-left" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-delay="500">
                         <div><Icon size={100} icon={basic_printer}/></div>
                         <div className={'card-title'}>Generate Receipts</div>
                         <div className={'card-content'}>We validate all your transactions with adequate receipts and notifications.</div>
                     </div>
                 </div>
             </div>
         </div>
         <div className={'container'}>
             <div className={'item-send-money'}>
                 <span className={'title'}>Send Money Online Using <i style={{"color":"#1cb8b9"}}>eTransecurepay</i></span>
                 <div className={'description'}>
                     <div data-aos-once="true" data-aos="flip-left" data-aos-easing="ease" data-aos-duration="800" data-aos-delay="100">
                         <img src={MainImage} alt=""/>
                     </div>
                     <div data-aos-once="true" data-aos="fade-up" data-aos-easing="ease" data-aos-duration="800" data-aos-delay="500">
                         <p>Always Ready</p>
                         Sending money worldwide with <i style={{"color":"#1cb8b9"}}>eTransecurepay</i> is easy. With the <a style={{"color":"#1cb8b9"}} href="http://etransecurepay.com">eTransecurepay.com</a> money
                         transfer service you can send money worldwide from any Internet-enabled computer to friends and family in more than
                         29 countries. You can have funds withdrawn directly from your bank account to fund the money transfer,
                         or pay using major credit cards. Recipients will be able to pick up the money in cash, have the money directly
                         deposited into their bank account, or delivered to their door. Options vary by country.

                     </div>
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
        userStatus: state.userStatus, userContent: state.userContent, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithoutData: authorizeWithoutData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
