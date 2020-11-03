import React from "react";
import { Route, Redirect } from "react-router-dom";
import { checkConfirmed, checkUser } from "./Cookies.js";
import HeaderNav from './HeaderNav';


const OwnerRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route
            {...rest}
            render={(props) =>
                (checkUser() == "cinemaowner" && checkConfirmed()) ? (
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

export default OwnerRoute;