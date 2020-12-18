import React from "react";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";
import { setCookie } from "./Cookies";

const socket = io.connect();

export function Logout(props) {
    // setCookie(null, null);
    // socket.emit('disconnect');
    // return <Redirect to="/login" />;
    alert('Please re-login!')
}