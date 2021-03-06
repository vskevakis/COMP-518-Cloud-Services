import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import OwnerRoute from "./OwnerRoute";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";

import Register from "../pages/Register";
import Login from "../pages/Login";
import { Logout } from "./Logout";
import Home from "../pages/Home";
import Movies from "../pages/Movies"
import Admin from "../pages/Admin";
import CinemaOwner from "../pages/CinemaOwner";


const Routes = () => (
    <Switch >
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <PrivateRoute path="/home" component={Home} />
        <UserRoute path="/movies" component={Movies} />
        <OwnerRoute path="/owner" component={CinemaOwner} />
        <AdminRoute path="/admin" component={Admin} />
    </Switch>
);

export default Routes;