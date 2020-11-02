import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";

import background1 from '../assets/backgrounds/background-movie-2.jpg';
import background2 from '../assets/backgrounds/background-movie-3.jpg';
import background3 from '../assets/backgrounds/background-movie-6.jpg';
import background4 from '../assets/backgrounds/background-movie-7.jpg';
import background5 from '../assets/backgrounds/background-movie-8.jpg';
import login_image from '../assets/illustrations/home_cinema_login.svg';
import logo from '../logo.png';

import axios from "axios";

import { checkCookie, setCookie } from "../components/Cookies";

const url = process.env.REACT_APP_SERVICE_URL;
class Login extends Component {
    constructor() {
        super();
        this.state = {
            bgStyle: {
                height: "100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            },
            username: "",
            password: "",
            isAuthenticated: checkCookie(),
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // check it out: we get the event.target.name (which will be either "username" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [event.target.name]: event.target.value });
    }
    componentWillMount() {
        const pictureArray = [background1, background2, background3, background4, background5];
        const randomIndex = Math.floor(Math.random() * pictureArray.length);
        const selectedPicture = pictureArray[randomIndex];

        this.setState({
            bgStyle: {
                backgroundImage: `url(${selectedPicture})`,
                height: "100vh",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const user_data = {
            username: this.state.username,
            password: this.state.password,
            isAuthenticated: false,
        };

        await axios.post(url + "/auth/login", user_data).then(
            (response) => {
                setCookie("token", response.data);
                this.setState({ isAuthenticated: true });
            },
            (error) => {
                alert("Authentication Unsuccesful. Please check your credentials.");
            }
        );
        this.setState({ username: "", password: "" });
    };

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to="/movies" />;
        }
        return (
            <div style={this.state.bgStyle} className="full-page-div bg">
                <Container className="container">
                    <Row className="justify-content-md-center">
                        <img className="logo" src={logo}></img>
                    </Row>
                    <Row className="my-form">
                        <Col className="login_image">
                            <img height="400px" src={login_image}></img>
                        </Col>
                        <Col>
                            <Form
                                onSubmit={this.handleSubmit}
                            >
                                <Form.Row className="justify-content-md-center">
                                    <h3>Sign In</h3>
                                </Form.Row>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="johndoe"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Row className="justify-content-md-center">
                                    <Button as={Col} variant="primary" type="submit" onClick={this.handleSubmit}>
                                        Login
                                    </Button>
                                </Row>
                                <Row className="justify-content-md-center">
                                    <a href="./register"> I don't have an account</a>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login;