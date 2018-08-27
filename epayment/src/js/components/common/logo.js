import React from 'react';
import {Link} from 'react-router-dom'

import logo from '../../../assets/images/logo.png'
class LogoMain extends React.Component {
    render(){
        return(
            <div className={'logo-contain'}>
                <Link to={'/'}><img src={logo}/></Link>
            </div>
        )
    }
}

export default LogoMain;