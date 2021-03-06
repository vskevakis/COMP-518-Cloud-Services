import React from "react";
import { setCookie } from "../components/Cookies";
import { Redirect } from "react-router-dom";


export function Logout(props) {
    setCookie("token", null);
    return (
        <Redirect to="/login" />
    )
}