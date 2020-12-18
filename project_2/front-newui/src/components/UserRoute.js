import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkUser } from "./Cookies.js";
import HeaderNav from './HeaderNav';

const UserRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route
            {...rest}
            render={(props) =>
                (checkUser() === "User" || checkUser() === "Cinema Owner" || checkUser() === "Admin") ? (
                    <div>
                        <HeaderNav {...props} />
                        <Component {...props} />
                    </div>
                ) : (
                        <div>
                            <HeaderNav {...props} />
                            <Component {...props} />
                            <Redirect to="/home" />
                        </div>
                    )
            }
        />
    );
};

export default UserRoute;