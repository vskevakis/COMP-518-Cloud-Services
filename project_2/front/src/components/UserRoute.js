import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkCookie } from "./Cookies.js";
import HeaderNav from './HeaderNav';

const UserRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route
            {...rest}
            render={(props) =>
                (checkCookie() === "User" || checkCookie() === "Cinema Owner" || checkCookie() === "Admin") ? (
                    <div>
                        <HeaderNav />
                        <Component {...props} />
                    </div>
                ) : (
                        <div>
                            <HeaderNav />
                            <Component {...props} />
                            <Redirect to="/home" />
                        </div>
                    )
            }
        />
    );
};

export default UserRoute;