// import jwt from "jsonwebtoken";
import axios from "axios";
import { Redirect } from "react-router-dom";

const url_prefix = process.env.REACT_APP_SERVICE_URL;
const base64key = process.env.REACT_APP_BASE64_AUTH;


export function setCookie(access_token, refresh_token) {
    document.cookie = 'access_token' + "=" + access_token + ";path=/";
    document.cookie = 'refresh_token' + "=" + refresh_token + ";path=/";
    if (!access_token) {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        // document.cookie = 'username' + "=" + null + ";path=/";
        // document.cookie = 'user_id' + "=" + null + ";path=/";
        // document.cookie = 'user_role' + "=" + null + ";path=/";
    }
    else {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + base64key
        }
        axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/idm/user?access_token=" + access_token,
            data: null,
            headers: headers
        }).then(
            (response) => {
                document.cookie = 'username' + "=" + response.data.username + ";path=/";
                document.cookie = 'user_id' + "=" + response.data.id + ";path=/";
                try {
                    if (response.data.roles[0].name)
                        document.cookie = 'user_role' + "=" + response.data.roles[0].name + ";path=/";
                    else {
                        document.cookie = 'user_role' + "=" + 'unconfirmed' + ";path=/"; // If user exists but he doesn't have a role yet (he is unconfirmed)
                    }
                } catch {
                    document.cookie = 'user_role' + "=" + 'unconfirmed' + ";path=/"; // If user exists but he doesn't have a role yet (he is unconfirmed)
                }
            },
            (error) => {
                console.log("You failed AGAIN");
                console.log(error);
            }
        );
    }
}


export async function renewToken() {
    let refresh_token = getCookie("refresh_token")
    const user_data = 'grant_type=refresh_token&refresh_token=' + refresh_token;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64key
    }

    await axios({
        method: 'post', //you can set what request you want to be
        url: url_prefix + "/idm/oauth2/token",
        data: user_data,
        headers: headers
    }).then(
        (response) => {
            console.log('Token Renewed');
            console.log(response);
            setCookie(response.data.access_token, response.data.refresh_token);
        },
        (error) => {
            setCookie(null, null);
            console.log(error);
            return <Redirect to="/login" />;
        }
    );
}

export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function checkUser() {
    return getCookie("user_role");
}

export function checkCookie() {
    return getCookie("username");
}

export function checkToken() {
    return getCookie("access_token");
}

export function checkUserID() {
    return getCookie("user_id");
}