import React from 'react';
import {Icon} from 'react-icons-kit';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import {logout} from 'react-icons-kit/iconic/logout'
import {cog} from 'react-icons-kit/iconic/cog'
import {threeUp} from 'react-icons-kit/iconic/threeUp'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import {history as History} from 'react-icons-kit/icomoon/history'
import {bubble2} from 'react-icons-kit/icomoon/bubble2'


import {setContent} from '../../redux/actions'

class Navbar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loggingOut: false, logOut: false,
        }
    }

    logOutFunc(){
        this.setState({loggingOut:true});
        setTimeout(() => {
            localStorage.removeItem('etrans-admin');
            this.props.setContent("SET_ADMIN_ACTIVE", false);
            this.props.history.push('/login')
        }, 1000)
    }

    render(){

        return(
            <div className={'navbar-container'}>
                <div className={'navbar-title'}><Link to={'/'}>EtranSecurepay-Admin</Link></div>
                <div className={'navbar-right'}>
                    <div> Welcome <button><strong>Admin</strong> &nbsp;<Icon icon={threeUp}/>
                        <div className={'navbar-dropdown'}>
                            <Link to={'/profile'}><li><Icon icon={cog}/>&nbsp;Account</li></Link>
                            <Link to={'/transactionlog'}><li><Icon icon={History}/>&nbsp;Transaction Log</li></Link>
                            <Link to={'/enquiries'}><li><Icon icon={bubble2}/>&nbsp;Enquires</li></Link>
                            {
                                this.state.loggingOut ? <li>
                                    <span className={'loading'}><Icon icon={spinner2}/></span>&nbsp;Signing out
                                </li> :
                                    <li onClick={() => this.logOutFunc()}>
                                        <Icon icon={logout}/>&nbsp;Sign Out
                                    </li>
                            }

                        </div>
                    </button>
                    </div>

                </div>
            </div>
        )
    }
}

Navbar.defaultProps = {
    account: ""
};

Navbar.propTypes = {
    history : PropTypes.object.isRequired,
    account: PropTypes.string,
};

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        setContent: setContent,
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(Navbar);