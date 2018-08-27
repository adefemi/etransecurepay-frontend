import React from 'react';
import {Icon} from 'react-icons-kit';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import {androidMoreVertical} from 'react-icons-kit/ionicons/androidMoreVertical'
import NumberFormat from 'react-number-format'
import {ic_power_settings_new} from 'react-icons-kit/md/ic_power_settings_new'
import {iosWorldOutline} from 'react-icons-kit/ionicons/iosWorldOutline'
import {home} from 'react-icons-kit/ionicons/home'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'




import GoUp from './common/go_up';
import Footer from './common/footer';
import Loading from './common/loader';
import TranferMoney from './common/transfer_money';
import {actionWithoutData, authorizeWithoutData, setContent} from '../redux/actions'

const initialState = {
    TransferActive: false, loggingOut: false, logOut: false, userStatus: null, userProfileList: null, userAccountList: null,

};
import LogoMain from './common/logo'
class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(props){
        if(this.props.userStatus !== this.state.userStatus){
            this.setState({userStatus: this.props.userStatus});
            if(!this.props.userStatus) {
                this.props.history.push('/')
            }
        }

        if(props.userContent.hasOwnProperty('userProfileList')){
            if(props.userContent.userProfileList !== this.state.userProfileList){
                this.setState({userProfileList: props.userContent.userProfileList});
            }
        }
        if(props.userContent.hasOwnProperty('userProfileList')){
            if(props.userContent.userProfileList !== this.state.userProfileList){
                this.setState({userProfileList: props.userContent.userProfileList});
            }
        }

        if(props.userContent.hasOwnProperty('userAccountList')){
            if(props.userContent.userAccountList !== this.state.userAccountList){
                this.setState({userAccountList: props.userContent.userAccountList});
            }
        }

    }

    getTotalMoney(){
        let _List = [...this.state.userAccountList].filter(o => o.user.id === this.props.userStatus.id)[0];
        let TotalMoney = _List.checkingAVB + _List.royaleAVB;
        return(
            <NumberFormat
                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                value={TotalMoney}
                disabled={true}
            />
        )
    }
    getUserInfo(){
        let _List = [...this.state.userProfileList].filter(o => o.user.id === this.state.userStatus.id)[0];
        return(
            <ul data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="100" data-aos-duration="500">
                <li>
                    <label>Account Name</label>
                    <div className={'content'} style={{"textTransform":"capitalize"}}>{_List.user.first_name}</div>
                </li>
                <li>
                    <label>Account Number</label>
                    <div className={'content'}>{_List.account_number}</div>
                </li>
                <li>
                    <label>Account Status</label>
                    <div className={'content'}>
                        <div className={'status success'}> </div> Active
                    </div>
                </li>
            </ul>
        )
    }
    getAccountInfo(){
        let _List = [...this.state.userAccountList].filter(o => o.user.id === this.state.userStatus.id)[0];
        return(
            <div>
                <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="200" data-aos-duration="500">
                    <div className={'title'}>CHECKING ACCOUNT</div>
                    <div className={'content'}>
                        <li>
                            <label>Available Balance:</label>
                            <NumberFormat
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                value={_List.checkingAVB}
                                disabled={true}
                            />
                        </li>
                        <li>
                            <label>Pending Balance:</label>
                            <NumberFormat
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                value={_List.checkingPNB}
                                disabled={true}
                            />
                        </li>
                    </div>
                </div>
                <div className={'account-item'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="300" data-aos-duration="500">
                    <div className={'title'}>ROYALE CHECKING ACCOUNT</div>
                    <div className={'content'}>
                        <li>
                            <label>Available Balance:</label>
                            <NumberFormat
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                value={_List.royaleAVB}
                                disabled={true}
                            />
                        </li>
                        <li>
                            <label>Pending Balance:</label>
                            <NumberFormat
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                value={_List.royalePNB}
                                disabled={true}
                            />
                        </li>
                    </div>
                </div>
            </div>
        )
    }

    logOutFunc(){
        this.setState({loggingOut:true});
        setTimeout(() => {
            localStorage.removeItem('etrans-user');
            this.props.setContent("SET_USER_ACTIVE", false);
            this.props.history.push('/')
        }, 1000)
    }

    TransferControl(val){
        this.setState({TransferActive:val});
    }
    render(){
        return(
         this.props.userStatus === null || !this.props.userStatus? <Loading/>:
             <div className={'account-wrapper'}>
                 <GoUp/>
                 {
                     this.state.TransferActive ? <TranferMoney  disableSignin={this.TransferControl.bind(this)}/> : null
                 }
                 <div className={'account-header'}>
                     <header>
                         <div className={'navbrand'}><Link to={'/'}>Etransecurepay</Link></div>
                         <div className={'navright'}>
                             <li>Total Balance: <span>
                                 {
                             this.state.userAccountList === null ?
                                 <span className={'loading'}><Icon icon={spinner2} /></span>:
                                 this.getTotalMoney()
                             }
                             </span></li>
                             <li className={'username'}>welcome <span style={{"textTransform":"capitalize"}}>{this.props.userStatus.username}</span>
                                 {
                                     this.state.loggingOut ? <span className={'logging loading'} ><Icon icon={spinner2}/>&nbsp;Logging out
                                         </span> :
                                         <span className={'logging'} onClick={() => this.logOutFunc()}>&nbsp;Logout
                                         </span>
                                 }
                                 <button>

                             </button></li>
                         </div>
                     </header>
                 </div>
                 <div className={'account-title'}>
                     <div className={'content'}>
                         <div><Icon size={25} icon={home}/> My Account</div>
                         <button onClick={() => this.TransferControl(true)}
                                 data-aos-once="true" data-aos="flip-left" data-aos-easing="ease-out-back" data-aos-delay="500" data-aos-duration="1000">
                             <Icon size={20} icon={iosWorldOutline}/>&nbsp;Money Transfer
                         </button>
                     </div>

                 </div>
                 <div className={'account-main'}>
                     <div className={'account-control'}>
                         {
                             this.state.userProfileList === null ? <h2>Loading</h2> :
                                 <div className={'account-brief'}>
                                     <h3>Account Details</h3>
                                     {this.getUserInfo()}
                                 </div>
                         }
                         {
                             this.state.userAccountList === null ? <h2>Loading</h2> :
                                 <div className={'banking-details'}>
                                     <h3>Online Account Statement</h3>
                                     {this.getAccountInfo()}
                                 </div>
                         }

                     </div>
                 </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Account);
