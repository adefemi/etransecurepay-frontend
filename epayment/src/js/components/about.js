import React from 'react';
import {Link} from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import {androidDoneAll} from 'react-icons-kit/ionicons/androidDoneAll';
import {connect} from 'react-redux'

import GoUp from './common/go_up';
import Footer from './common/footer';
import HowToSend from './common/howToSend';

import SubImage from '../../assets/images/payment.png'

const initialState = {
    userStatus: null,
};
import LogoMain from './common/logo'

class About extends React.Component {
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
    render(){
    return(
        <div className={'wrapper_main'}>
            <GoUp/>
            <div className={'header'}>
                <LogoMain/>
                <div className={'background'}> </div>
                <div className={'cover-back'}> </div>
                <div className={'navbar-main'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-delay="1000" data-aos-duration="300">
                    <Link to={'/'}><li >Home</li></Link>
                    <Link to={'/about'}><li className={'active'}>About</li></Link>
                    <Link to={'/contact'}><li>Contact</li></Link>
                </div>
                <div className={'content'}>
                    <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="400" data-aos-anchor-placement="top-center">ABOUT ETRANSECUREPAY!</div>

                </div>
            </div>
            <div className={'container'}>
                <div className={'item-about1'}>
                    <div data-aos-once="true" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="100" data-aos-duration="500">
                        <h3>Mission</h3>
                        <p>Our mission is to provide access to the latest technology, harnessing the capabilities and share undisputed transmission of transactions
                        </p>
                    </div>

                   <div data-aos-once="true" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="400" data-aos-duration="500">
                       <h3>Vision</h3>
                       <p>We are in the cause of creating a world of fully functional computerized banking service with ease and transparency in transactions.</p>
                   </div>
                </div>

            </div>

            <div className={'container'}>
                <div className={'item-send-money'}>
                    <span className={'title'}>We have provided all that you will need</span>
                    <div className={'description'}>
                        <div  data-aos-once="true" data-aos="zoom-in-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                            <img src={SubImage} alt=""/>
                        </div>
                        <div>
                            <div className={'content-des'}  data-aos-once="true" data-aos="flip-down" data-aos-easing="ease" data-aos-delay="300" data-aos-duration="500">
                                Total control over your account with <i style={{"color":"#1cb8b9"}}> &nbsp;eTransecurepay</i>!!!
                            </div>
                            <div className={'packageList'}>
                                <li data-aos-once="true" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="400" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Visual decency and interactiveness of the highest order</li>
                                <li data-aos-once="true" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="500" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Approval by the <i style={{"color":"#1cb8b9"}}>eTransecurepay</i> proprietary anti-fraud verification system</li>
                                <li data-aos-once="true" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="600" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Funds availability from sender's payment account (checking, credit or debit card)</li>
                                <li data-aos-once="true" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="700" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Recipient-country banking hours and banking system availability</li>
                                <li data-aos-once="true" data-aos="fade-right" data-aos-easing="ease" data-aos-delay="800" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Difference in time zones, weekend bank processing availability, and local bank holidays</li>
                                <li data-aos-once="true" data-aos="fade-left" data-aos-easing="ease" data-aos-delay="900" data-aos-duration="500">
                                    <Icon size={30} icon={androidDoneAll}/> Receiving agent hours of operation</li>
                            </div>

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
        userStatus: state.userStatus, backEndLinks: state.backEndLinks
    })
}

export default connect(mapStateToProps)(About);
