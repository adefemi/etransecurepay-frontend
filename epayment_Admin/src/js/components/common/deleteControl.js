import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'react-icons-kit'
import {close} from 'react-icons-kit/ikons/close'
import {spinner2} from 'react-icons-kit/icomoon/spinner2'
import {alert} from 'react-icons-kit/ionicons/alert'



class DeleteControl extends React.Component{

    render(){
        return(
           <div className={'delete-contain'}>
               <div className={'content'}>
                   <div className={'indicator'}>
                       <div className={'infoType'}>
                           <Icon size={25} icon={alert}/>
                           Delete Notice
                       </div>
                       <Icon onClick={() => this.props.closeDelete()} className={'close'} size={20} icon={close} />
                   </div>
                   <div className={'info'}>
                       {this.props.infoContent}
                   </div>
                   <div className={'controls'}>
                       <button type={'button'} onClick={() => this.props.closeDelete()}>Cancel</button>
                       {
                           this.props.deleteStatus ?<button type={'button'}><Icon icon={spinner2} className={'loading'}/></button>:
                               <button type={'button'} onClick={() => this.props.deleteFunction()}>Continue</button>

                       }

                   </div>
               </div>
           </div>
        )
    }
}

DeleteControl.propTypes = {
    closeDelete: PropTypes.func.isRequired,
    infoContent: PropTypes.string.isRequired,
    deleteStatus: PropTypes.bool.isRequired,
    deleteFunction: PropTypes.func.isRequired,
};

export default DeleteControl;