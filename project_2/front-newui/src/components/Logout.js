import React from "react";
import { Redirect } from "react-router-dom";

import { setCookie } from "../Authentication/cookies";

export function Logout(props) {
    setCookie(null, null);
    socket.emit('disconnect');
    return <Redirect to="/login" />;
}