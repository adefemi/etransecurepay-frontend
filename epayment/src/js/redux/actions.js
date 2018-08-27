import axios from 'axios';
axios.defaults.timeout = 8000;

export function actionWithData(type, url, payload){
    return dispatch => {
        return axios({
            method: type,
            url: url,
            data: payload
        })
    }
}

export function actionWithoutData(type, url){
    return dispatch => {
        return axios({
            method: type,
            url: url,
        })
    }
}

export function authorizeWithoutData(type, url, token){
    return dispatch => {
        return axios({
            method: type,
            url: url,
            headers: {Authorization:`Bearer ${token}`},
        })
    }
}

export function authorizeWithData(type, url, payload, token){
    return dispatch => {
        return axios({
            method: type,
            url: url,
            data: payload,
            headers: {Authorization:`Bearer ${token}`},
        })
    }
}

export function setContent(type, payload = null){
    return{
        type: type,
        payload: payload
    }
}

