import React from 'react'
import {combineReducers} from 'redux'

//import reducers
import {backEndLinks} from './extras';
import {setAdminActive} from './authentication';
import {setUserContent} from './userReducer';


const ReducerAll = combineReducers({
    backEndLinks : backEndLinks,
    userStatus : setAdminActive,
    userContent : setUserContent,
});

export default ReducerAll