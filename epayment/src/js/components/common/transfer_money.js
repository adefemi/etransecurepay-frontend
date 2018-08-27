import React from 'react';
import proptypes from 'prop-types'
import { Icon } from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {ic_person} from 'react-icons-kit/md/ic_person';
import {ic_clear} from 'react-icons-kit/md/ic_clear'
import {creditCard} from 'react-icons-kit/icomoon/creditCard'
import {office} from 'react-icons-kit/icomoon/office'
import {envelop} from 'react-icons-kit/icomoon/envelop'
import {globe} from 'react-icons-kit/iconic/globe'
import {coinDollar} from 'react-icons-kit/icomoon/coinDollar'
import {ic_send} from 'react-icons-kit/md/ic_send'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import NumberFormat from 'react-number-format'
import EmailValidator from 'email-validator'
import {spinner} from 'react-icons-kit/icomoon/spinner'


import resetToken from './resetToken';

const initialState = {
  amount: "", accnum: "", accname: "", bankname: "", benEmail: "", benAccNum: "", country: "", code: "", countryList: "",
    swiftAvailable: true, swiftCodeList: null, submit: null, userAccountList: null, userProfileList: null,
    checkingAVB: null, royaleAVB: null, amountInCur: "", activeSwift: null, reference: null, transcomplete: false,
    benName: "",

};

import {actionWithoutData, authorizeWithoutData, setContent, authorizeWithData} from '../../redux/actions'

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

class TransferMoney extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount(){
        this.getCountry();
        this.componentWillReceiveProps(this.props)
    }
    componentWillReceiveProps(props){
        if(props.userContent.hasOwnProperty('swiftCodeList')){
            if(props.userContent.swiftCodeList !== this.state.swiftCodeList){
                this.state.swiftCodeList = props.userContent.swiftCodeList;
                this.setState({swiftCodeList: props.userContent.swiftCodeList});
            }
        }
        if(props.userContent.hasOwnProperty('userAccountList')){
            if(props.userContent.userAccountList !== this.state.userAccountList){
                this.setState({userAccountList: props.userContent.userAccountList});
            }
        }
        if(props.userContent.hasOwnProperty('userProfileList')){
            if(props.userContent.userProfileList !== this.state.userProfileList){
                this.setState({userProfileList: props.userContent.userProfileList});
                this.state.userProfileList = props.userContent.userProfileList;
                this.getActiveUser();
            }
            else{
                this.getActiveUser();
            }
        }
    }
    getCountry(){
        let url = "https://restcountries.eu/rest/v2/all";
        this.props.actionWithoutData("get", url).then(
            res => {
                this.setState({countryList:res.data})
            },
            err => {
                alert("unable to get country list")
            }
        )
    }
    loadCountries(){
        let _list = [...this.state.countryList];
        let _countryList = [];
        _countryList.push(<option key={0}>Select country</option>);
        for(let i = 0; i < _list.length; i++){
            _countryList.push(
                <option key={i+1} value={_list[i].name}>{_list[i].name}</option>
            )
        }
        return _countryList;
    }

    getSwift(){
        this.setState({swiftAvailable: true});
        let _swiftList = [...this.state.swiftCodeList];
        let activeList = _swiftList.filter(o => o.user === this.props.userStatus.id);
        if(activeList.length < 1){
            this.setState({submit: null, swiftAvailable:false});
        }
        else{
            this.setState({code: activeList[0].code, activeSwift: activeList[0].id, submit: null})
        }
    }

    handSubmit(access = null){
        if(this.validator()> 0)return;
        let referenceNum = "ETRS"+randomString(4);
        this.state.reference = referenceNum;
        let url = this.props.backEndLinks.transaction;
        let accessToken = access;
        let dataTosend = {user: this.props.userStatus.id,amount: this.state.amountInCur, bankname: this.state.bankname,
            benEmail: this.state.benEmail, benAccNum: this.state.benAccNum, code: this.state.code, sender: this.state.accname,
            country: this.state.country, referenceNum: referenceNum, htmlTemplate: "html", benName: this.state.benName
        };
        access === null ? accessToken = JSON.parse(localStorage.getItem('etrans-user')).access: null;
        this.props.authorizeWithData('post',url, dataTosend, accessToken).then(
            res => {
                this.validateAmount();
                url = this.props.backEndLinks.userAccount+this.props.userStatus.id+"/";
                dataTosend = {checkingAVB: this.state.checkingAVB, royaleAVB: this.state.royaleAVB};
                this.props.authorizeWithData('patch',url, dataTosend, accessToken).then(
                    rem => {
                        url = this.props.backEndLinks.swiftCode+this.state.activeSwift+"/";
                        this.props.authorizeWithoutData('delete',url,accessToken).then(
                            ren => {
                                alert("Transaction Completed");
                                this.props.userContent.swiftCodeList = [...this.props.userContent.swiftCodeList].filter(o => o.id !== this.state.activeSwift);
                                this.props.userContent.userAccountList = [...this.props.userContent.userAccountList].filter(o => o.user.id !== this.props.userStatus.id);
                                this.props.userContent.userAccountList.push(rem.data);
                                this.props.setContent("SET_USER_CONTENT",this.props.userContent);
                                this.setState({submit: null, code:"", transcomplete:true});
                            },
                            err => {
                                this.setState({submit: null});
                                alert('Network error')
                            }
                        );
                    },
                    err => {
                        this.setState({submit: null});
                        alert('Network error')
                    }
                );
            },
            err => {
                this.setState({submit: null});
                this.processError(err)
            }
        )
    }

    validateAmount(){
        let _List = [...this.state.userAccountList].filter(o => o.user.id === this.props.userStatus.id)[0];
        _List.checkingAVB = _List.checkingAVB - this.state.amount;
        if(_List.checkingAVB < 0){
            _List.royaleAVB = _List.royaleAVB - Math.abs(_List.checkingAVB);
            _List.checkingAVB = 0.0;
        }
        this.state.checkingAVB = _List.checkingAVB;
        this.state.royaleAVB = _List.royaleAVB;
    }

    getTotalAmmount(){
        let _List = [...this.state.userAccountList].filter(o => o.user.id === this.props.userStatus.id)[0];
        return _List.checkingAVB + _List.royaleAVB;
    }

    getActiveUser(){
        let _List = [...this.state.userProfileList].filter(o => o.user.id === this.props.userStatus.id)[0];
        this.setState({accnum: _List.account_number, accname: this.props.userStatus.first_name})
    }

    validator(){
        if(this.state.amount.length < 1){
            alert("Amount cannot be empty"); this.setState({submit: null}); return 1
        }
        if(this.state.amount > this.getTotalAmmount() ){
            alert("Your account is too low for this transaction"); this.setState({submit: null}); return 1
        }
        if(this.state.accnum.length < 1){
            alert("Account Number cannot be empty"); this.setState({submit: null}); return 1
        }
        if(this.state.accname.length < 1){
            alert("Account Name cannot be empty"); this.setState({submit: null}); return 1
        }
        if(this.state.bankname.length < 1){
            alert("Bank Name cannot be empty"); this.setState({submit: null}); return 1
        }
        if(this.state.benName.length < 1){
            alert("Beneficiary Name cannot be empty"); this.setState({submit: null}); return 1
        }
        if(!EmailValidator.validate(this.state.benEmail)){
            alert("Email must be a valid email address"); this.setState({submit: null}); return 1
        }
        if(this.state.benAccNum.length < 1){
            alert("Beneficiary Account Number is required"); this.setState({submit: null}); return 1
        }
        if(this.state.code.length < 1){
            alert("Swift code is required"); this.setState({submit: null}); return 1
        }
        if(this.state.country.length < 1){
            alert("Please select a country"); this.setState({submit: null}); return 1
        }
        return 0
    }

    processError(err){
        if(err.message === "Network Error"){
            setTimeout(() => {
                    alert("etwork error! Check your network and try again!!!"); this.setState({submit: null});
                },
                100);
        }
        else {
            if(err.code === 'ECONNABORTED'){
                alert("Operation timeout! Check your network and try again"); this.setState({submit: null});
            }
            else if(err.response.statusText === "Unauthorized"){
                let newaccess = resetToken(this.props.backEndLinks.refresh);
                this.handSubmit(newaccess)
            }
            else{
                let errorcontent = '';
                Object.entries(err.response.data).forEach(
                    ([key, value]) => {
                        errorcontent+="* "+key+" - "+value+"\n"
                    }
                );
                alert(errorcontent); this.setState({submit: null});
                console.log(err.response)
            }
        }
    }

    render(){
        const {disableSignin} = this.props;
        return(
            <div className={'sign-container'}>
                {
                    this.state.transcomplete ?
                        <div className={'transaction-notification'}>
                        <h3>TRANSACTION - SUCCESS</h3>
                        <p>Shown below are the details of transaction</p>
                        <div className={'trans-content-list'}>
                            <ul>
                                <li>Sender:</li>
                                <li>{this.state.accname}</li>
                            </ul>
                            <ul>
                                <li>Account Number:</li>
                                <li>{this.state.accnum}</li>
                            </ul>
                            <ul>
                                <li>Beneficiary Bank:</li>
                                <li>{this.state.bankname}</li>
                            </ul>
                            <ul>
                                <li>Country:</li>
                                <li>{this.state.country}</li>
                            </ul>
                            <ul>
                                <li>Beneficiary Name:</li>
                                <li>{this.state.benName}</li>
                            </ul>
                            <ul>
                                <li>Beneficiary Email:</li>
                                <li style={{"textTransform":"lowercase"}}>{this.state.benEmail}</li>
                            </ul>
                            <ul>
                                <li>Beneficiary Account Number:</li>
                                <li>{this.state.benAccNum}</li>
                            </ul>

                            <ul>
                                <li>Amount:</li>
                                <li>{this.state.amountInCur}</li>
                            </ul>

                            <ul>
                                <li>Reference Number:</li>
                                <li>{this.state.reference}</li>
                            </ul>

                            <p>Thanks for using Etransecurepay!</p>
                            <p>Regards</p>
                        </div>
                    </div> :
                        <form className={'sign-in-form'}>
                        <div className={'sign-input-group'}>
                            <NumberFormat
                                thousandSeparator={true} prefix={'$'} decimalScale={2} fixedDecimalScale={true}
                                value={this.state.amount}
                                onValueChange={(values) => {
                                    const {formattedValue, value} = values;
                                    this.setState({amount: value, amountInCur:formattedValue})
                                }}
                                placeholder={' '}
                            />
                            <label htmlFor="username">Amount</label>
                            <Icon icon={coinDollar}/>
                        </div>
                        <div className={'sign-input-group'}>
                            <input type="text" placeholder={' '} value={this.state.bankname} onChange={(e) => this.setState({bankname:e.target.value})}/>
                            <label htmlFor="username">Beneficiary Bank</label>
                            <Icon icon={office}/>
                        </div>
                        <div className={'sign-input-group'}>
                            <select placeholder={' '} onChange={(e) => this.setState({country:e.target.value})}>
                                {
                                    this.state.countryList === null ? <option>Loading</option> :
                                        this.loadCountries()
                                }
                            </select>
                            <label htmlFor="username">Country</label>
                            <Icon icon={globe}/>
                        </div>
                        <div className={'sign-input-group'}>
                            <input type="text" placeholder={' '} value={this.state.benName} onChange={(e) => this.setState({benName:e.target.value})}/>
                            <label htmlFor="username">Beneficiary Name</label>
                            <Icon icon={ic_person}/>
                        </div>
                        <div className={'sign-input-group'}>
                            <input type="email" placeholder={' '} value={this.state.benEmail} onChange={(e) => this.setState({benEmail:e.target.value})}/>
                            <label htmlFor="username">Beneficiary Email</label>
                            <Icon icon={envelop}/>
                        </div>
                        <div className={'sign-input-group'}>
                            <input type="number" placeholder={' '} value={this.state.benAccNum} onChange={(e) => this.setState({benAccNum:e.target.value})}/>
                            <label htmlFor="number">Beneficiary Account Number</label>
                            <Icon icon={creditCard}/>
                        </div>

                        <div className={'sign-input-group'}>
                            <input disabled={true} type="text" placeholder={' '} value={this.state.code} onChange={(e) => this.setState({code:e.target.value})}/>
                            <label htmlFor="username">Swift Code</label>
                            {
                                this.state.swiftCodeList === null ? null :
                                    <button type={'button'} onClick={() => [this.setState({submit:"gen"}), this.getSwift()]}> {this.state.submit === "gen" ? "Generating": "Generate"} </button>
                            }
                        </div>
                        {
                            !this.state.swiftAvailable? <div>Swift code is not available for your transaction!, kindly email at
                                    <a style={{"color":"blue"}} href="mailto:contact-admin@etransecurepay.com"> contact-admin@etransecurepay.com</a></div>
                                :null
                        }


                        {
                            this.state.userAccountList === null || this.state.userProfileList === null ? null :
                                this.state.submit ?
                                    <button type={'button'}>Processing&nbsp;<span className={'loading'}><Icon icon={spinner}/></span></button>
                                    :
                                    <button type={'button'} onClick={() => [this.setState({submit: true}), setTimeout(() => {this.handSubmit()}, 1000)]}>Send&nbsp;<Icon size={20} icon={ic_send} /></button>

                        }
                    </form>
                }


                <div className={'close'} onClick={() => disableSignin(false)}><Icon size={25} icon={ic_clear}/></div>
            </div>
        )
    }
}

TransferMoney.propTypes = {
  disableSignin : proptypes.func.isRequired,
};

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, userContent: state.userContent, backEndLinks: state.backEndLinks
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithoutData: authorizeWithoutData,
        authorizeWithData: authorizeWithData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferMoney);