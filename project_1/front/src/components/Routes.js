import React, { Header } from "react";
import { Link, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Helpers";

import Register from "../pages/Register";
import Login from "../pages/Login";
import { Logout } from "../pages/Logout";

import Home from "../pages/Home";
import Movies from "../pages/Movies"
import Admin from "../pages/Admin";
import CinemaOwner from "../pages/CinemaOwner";
// const NavRoute = ({ exact, path, component: Component }) => (
//     <Route exact={exact} path={path} render={(props) => (
//         <div>
//             <Nav />
//             <Component {...props} />
//         </div>
//     )} />
// )

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <PrivateRoute path="/movies" component={Movies} />
        <PrivateRoute path="/owner" component={CinemaOwner} />
        <PrivateRoute path="/admin" component={Admin} />
    </Switch>
);

export default Routes;