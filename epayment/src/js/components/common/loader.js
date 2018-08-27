import React from 'react';
import {Icon} from 'react-icons-kit'
import {spinner9} from 'react-icons-kit/icomoon/spinner9'

class Footer extends React.Component {
    render(){
        return(
            <div className={'Loader-main'}>
                <div className={'loading'}><Icon size={50} icon={spinner9}/></div>
            </div>
        )
    }
}

export default Footer;