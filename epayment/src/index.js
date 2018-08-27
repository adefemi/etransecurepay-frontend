import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'

import 'aos/dist/aos.css';
import './assets/css/style.css';
import Router from './js/router';

import RootReducer from './js/redux/reducer/rootReducer'

const Store = createStore(RootReducer, applyMiddleware(thunk));

class Index extends React.Component{
    render(){
        return(
            <Provider store={Store}>
                <Router />
            </Provider>
        )
    }
}


ReactDOM.render(<Index/>, wrapper);
