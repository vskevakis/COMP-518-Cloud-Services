import jwt from "jsonwebtoken";
import axios from "axios";

const url_prefix = process.env.REACT_APP_SERVICE_URL;
const base64key = "MDJiMjEzZTctZjYyNy00YWI1LTlhZmItODg2ZjhlODllNzU2OjViMTdmODA2LWYzN2ItNDgwNC1hNzJkLWUwYzI1NmUxZjI1Mg=="


export function setCookie(access_token, refresh_token) {
    document.cookie = 'access_token' + "=" + access_token + ";path=/";
    document.cookie = 'refresh_token' + "=" + refresh_token + ";path=/";
    if (access_token == null) {
        document.cookie = 'username' + "=" + null + ";path=/";
        document.cookie = 'user_id' + "=" + null + ";path=/";
        document.cookie = 'user_role' + "=" + null + ";path=/";
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
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
            if (response.data.organizations.name)
                document.cookie = 'user_role' + "=" + response.data.roles[0].name + ";path=/";
            else {
                document.cookie = 'user_role' + "=" + 'unconfirmed' + ";path=/"; // If user exists but he doesn't have a role yet (he is unconfirmed)
            }
        },
        (error) => {
            console.log("You failed AGAIN");
            console.log(error);
        }
    );
}

export function renewToken() {
    let rtoken = getCookie("refresh_token")
    const user_data = 'grant_type=refresh_token&refresh_token=' + rtoken;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64key //+ base64(client_id: client_secret);
    }

    axios({
        method: 'post', //you can set what request you want to be
        url: url_prefix + "/idm/oauth2/token",
        data: user_data,
        headers: headers
    }).then(
        (response) => {
            console.log(response);
            setCookie(response.data.access_token, response.data.refresh_token)
        },
        (error) => {
            setCookie(null, null);
            console.log(error);
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
    // let token = getCookie("token");
    // console.log("token is: ", token);
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    // }
    // axios({
    //     method: 'get', //you can set what request you want to be
    //     url: url_prefix + "/idm/user?access_token=" + token,
    //     data: null,
    //     headers: headers
    // }).then(
    //     (response) => {
    //         if (response.data.organizations.name)
    //             return response.data.organizations.name;
    //         else {
    //             return "unconfirmed"; // If user exists but he doesn't have a role yet (he is unconfirmed)
    //         }
    //     },
    //     (error) => {
    //         console.log("You failed AGAIN");
    //         console.log(error);
    //     }
    // );
    // let username = getCookie("username");
    return getCookie("user_role");
}

export function checkCookie() {
    // let token = getCookie("token");
    // console.log("token is: ", token);
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    // }
    // axios({
    //     method: 'get', //you can set what request you want to be
    //     url: url_prefix + "/idm/user?access_token=" + token,
    //     data: null,
    //     headers: headers
    // }).then(
    //     (response) => {
    //         return response.data.username;
    //     },
    //     (error) => {
    //         console.log("You failed AGAIN");
    //         console.log(error);
    //     }
    // );
    return getCookie("username");

}

// export function checkConfirmed() {
//     let token = getCookie("token");
//     console.log("token is: ", token);
//     const headers = {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     }
//     axios({
//         method: 'get', //you can set what request you want to be
//         url: url_prefix + "/idm/user?access_token=" + token,
//         data: null,
//         headers: headers
//     }).then(
//         (response) => {
//             return response.data.organizations.name;
//         },
//         (error) => {
//             console.log("You failed AGAIN");
//             console.log(error);
//         }
//     );
// }

export function checkUserID() {
    // let token = getCookie("token");
    // console.log("token is: ", token);
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    // }
    // axios({
    //     method: 'get', //you can set what request you want to be
    //     url: url_prefix + "/idm/user?access_token=" + token,
    //     data: null,
    //     headers: headers
    // }).then(
    //     (response) => {
    //         return response.data.id;
    //     },
    //     (error) => {
    //         console.log("You failed AGAIN");
    //         console.log(error);
    //     }
    // );
    return getCookie("user_id");
}