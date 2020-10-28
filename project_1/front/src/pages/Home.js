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
            <Container className="mycont">
                <h1>This is home page</h1>
            </Container>
        );
    }
}

export default Home;