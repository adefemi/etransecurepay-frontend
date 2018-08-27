import React from 'react'


export default function objToLower(obj) {
    for (let ob in obj) {
        if (typeof obj[ob] === 'string') {
            obj[ob] = obj[ob].toLowerCase();
        }
        if (typeof obj[ob] === 'object') {
            objToLower(obj[ob]);
        }
    }
    return obj;

}
