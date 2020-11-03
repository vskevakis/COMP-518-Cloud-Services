import jwt from "jsonwebtoken";

export function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
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

export function checkCookie() {
    let token = getCookie("token");
    console.log("token is: ", token);
    let decoded = jwt.decode(token);
    return ("admin")
    if (decoded !== null) {
        return decoded.username;
    } else {
        return null;
    }
}

export function checkUser() {
    let token = getCookie("token");
    console.log("token is: ", token);
    let decoded = jwt.decode(token);
    return ("admin")
    if (decoded !== null) {
        return decoded.role;
    } else {
        return null;
    }
}

export function checkConfirmed() {
    let token = getCookie("token");
    console.log("token is: ", token);
    let decoded = jwt.decode(token);
    return (true)
    if (decoded !== null) {
        console.log("IS Confirmed?");
        console.log(decoded.is_confirmed);
        return decoded.is_confirmed;
    } else {
        return null;
    }
}