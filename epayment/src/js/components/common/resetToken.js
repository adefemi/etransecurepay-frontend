import React from 'react'
import axios from 'axios'


export default function resetToken(url) {
    let refreshUrl = url;
    let Token = JSON.parse(localStorage.getItem('etrans-user'));
    let payload = {"refresh":Token.refresh};

    axios({
        method: "post",
        url: refreshUrl,
        data: payload
    }).then(
        (res) => {
            Token.access = res.data.access;
            localStorage.setItem('etrans-user', JSON.stringify(Token));
            return res.data.access;
        },
        (err) => console.log(err.response)
    );

}
