import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkConfirmed, checkCookie } from "./Cookies.js";
import HeaderNav from './HeaderNav';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route
            {...rest}
            render={(props) =>
                (checkCookie() !== null) ? (
                    <div>
                        <HeaderNav />
                        <Component {...props} />
                    </div>
                ) : (
                        <div>
                            <HeaderNav />
                            <Component {...props} />
                            <Redirect to="/login" />
                        </div>
                    )
            }
        />
    );
};

export default PrivateRoute;