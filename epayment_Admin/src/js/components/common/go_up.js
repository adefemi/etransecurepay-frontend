import React from 'react';
import { Icon } from 'react-icons-kit';
import {ic_navigation} from 'react-icons-kit/md/ic_navigation';
import $ from 'jquery'

class GoUp extends React.Component {

    onScroll(){
        let defaultHeight = $(window).height();
        $(document).scroll(() => {
            let scrollFromTop = $(window).scrollTop();
            let goup = $('.go-up');
            if(scrollFromTop >= defaultHeight){
                !goup.hasClass('show') ? goup.addClass('show') : null;
            }
            else{
                goup.hasClass('show') ?  goup.removeClass('show') : null;
            }
        })

    }

    goup(){
        $('html, body, div').animate({scrollTop: 0}, 500)
    }

    render(){
        this.onScroll();
        return(
            <div className={'wrapper_main'}>
                <div className={'go-up'} onClick={() => this.goup()}>
                    <Icon size={25} icon={ic_navigation}/>
                </div>
            </div>
        )
    }
}

export default GoUp;