import React from 'react';
import {Link} from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import {ic_phone} from 'react-icons-kit/md/ic_phone';
import {ic_email} from 'react-icons-kit/md/ic_email';

class HowToSend extends React.Component {
    render(){
        return(
            <div>
                <div className={'item-how-to-send'}>
                    <div className={'wrapper'} data-aos-once="true" data-aos="fade-right" data-aos-easing="ease" data-aos-duration="500" data-aos-delay="300">
                        <p>HOW TO SEND MONEY INTERNATIONALLY WITH ETRANSECUREPAY</p>
                        Your recipient can receive cash in local currency or US dollars or in many countries can have the money deposited
                        to their bank account or have it delivered to their home. <a style={{"color":"#c3ff72"}} href="http://etransecurepay.com">eTransecurepay.com</a> has relationships with banks and money transfer
                        payout partners to provide a secure and fast means of sending customer's money. With these bank and money transfer payout partners,
                        <a style={{"color":"#c3ff72"}} href="http://etransecurepay.com">eTransecurepay.com</a> customers can send money to thousands of cash pickup locations around the world.

                        <div className={'extras'}>
                            <div>
                                <h3>Links</h3>
                                <Link to={'/'}><li>Terms of Services</li></Link>
                                <Link to={'/'}><li>Privacy Policy</li></Link>
                            </div>
                            <div>
                                <h3>Get in touch</h3>
                                <a href=""><li><Icon icon={ic_phone}/> +1234272829</li></a>
                                <a href=""><li><Icon icon={ic_email}/> contact-admin@etransecurepay.com</li></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default HowToSend;