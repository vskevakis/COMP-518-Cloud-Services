import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";

import { checkCookie, checkUser, setCookie } from "../components/Cookies";

class Home extends Component {
    constructor() {
        super();
        this.state = {
            username: checkCookie(),
            role: checkUser(),
            isAuthenticated: checkCookie(),
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // check it out: we get the event.target.name (which will be either "username" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <Container className="mycont" style={{ 'text-align': 'center' }}>
                <h1 style={{ 'text-decoration': 'underline' }}>Welcome to theCinemaDB</h1>
                <h3 style={{ 'text-align': 'center' }}>All users must be accepted by an admin in order to use this app. The following website is part of my project on Cloud Services course
                at ECE Department of the Technical University of Crete.</h3>
                <h5 style={{ 'text-align': 'center', 'color': 'gray', 'padding': '10%' }}>Feel free to use this for any non-commercial projects</h5>
            </Container >
        );
    }
}

export default Home;