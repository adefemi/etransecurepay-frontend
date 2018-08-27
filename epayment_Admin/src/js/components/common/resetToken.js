import React from 'react'
import axios from 'axios'


export default function resetToken(url) {
    let refreshUrl = url;
    let Token = JSON.parse(localStorage.getItem('etrans-admin'));
    let payload = {"refresh":Token.refresh};

    axios({
        method: "post",
        url: refreshUrl,
        data: payload
    }).then(
        (res) => {
            Token.access = res.data.access;
            localStorage.setItem('etrans-admin', JSON.stringify(Token));
            return res.data.access;
        },
        (err) => console.log(err.response)
    );

}
