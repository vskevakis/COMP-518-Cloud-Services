import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { Animate } from 'react-animate-mount'

import background1 from '../assets/backgrounds/background-image-01.png';
import background2 from '../assets/backgrounds/background-image-02.png';
import background3 from '../assets/backgrounds/background-image-03.png';
import background4 from '../assets/backgrounds/background-image-04.png';
import background5 from '../assets/backgrounds/background-image-05.png';
import background6 from '../assets/backgrounds/background-image-06.png';
import background7 from '../assets/backgrounds/background-image-07.png';
import background8 from '../assets/backgrounds/background-image-08.png';
import background9 from '../assets/backgrounds/background-image-09.png';
import background10 from '../assets/backgrounds/background-image-10.png';
import background11 from '../assets/backgrounds/background-image-11.png';
import background12 from '../assets/backgrounds/background-image-12.png';



import logo from '../logo.png';

import axios from "axios";

import { checkUser, checkCookie, setCookie } from "../components/Cookies";

// const client_id = "fd06208b-3a85-4296-b8f6-9d52c1127576";
const base64key = "YmEwYjkyY2MtMzc1OC00MjI1LTkxNDctYWI5NjE0MjE1MDM2OjRhNzhkZjc3LTRjMzItNDM5Yy04N2MyLTJhZmE2MzhiMjQ3Yg=="
const url_prefix = process.env.REACT_APP_SERVICE_URL;
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
            show: false

        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // check it out: we get the event.target.name (which will be either "username" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [event.target.name]: event.target.value });
    }
    componentWillMount() {
        this.setbgPic()
    }

    setbgPic() {
        const pictureArray = [background1, background2, background3, background4, background5, background6, background7, background8, background9, background10, background11, background12];
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

    componentDidMount() {
        this.setState({ show: true })
        setInterval(() => {
            this.setbgPic()
        }, 5000)
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const user_data = 'grant_type=password&username=' + this.state.username + '&password=' + this.state.password
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + base64key //+ base64(client_id: client_secret);
        }
        await axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/idm/oauth2/token",
            data: user_data,
            headers: headers
        }).then(
            (response) => {
                console.log(response);
                setCookie(response.data.access_token, response.data.refresh_token);
                this.setState({ isAuthenticated: true });
            },
            (error) => {
                setCookie(0, 0);
                console.log("You failed AGAIN");
                console.log(error);
            }
        );
    };

    render() {
        if (checkUser() === "Admin") {
            return <Redirect to="/admin" />;
        }
        else if (checkUser() === "Cinema Owner") {
            return <Redirect to="/cinemaowner" />;
        }
        else if (checkUser() === "User") {
            return <Redirect to="/movies" />;
        }
        else if (checkUser() === "unconfirmed") {
            return <Redirect to="/home" />;
        }
        return (
            <Animate type='fade' duration="500" show={this.state.show}>
                <Container fluid style={this.state.bgStyle} className="full-page-div bg">
                    <Row className="justify-content-md-center">
                        <img className="logo" src={logo}></img>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Form className="my-form"
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Row className="justify-content-md-center">
                                <h3>Sign In</h3>
                            </Form.Row>
                            <Form.Group controlId="formBasicUsername">
                                {/* <Form.Label>Username</Form.Label> */}
                                <Form.Control
                                    className="my-form"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control
                                    className="my-form"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            this.handleSubmit(event)
                                        }
                                    }}
                                />
                            </Form.Group>
                            {/* <Row className="justify-content-md-center"> */}
                            <Button as={Col} variant="dark" type="submit" onClick={this.handleSubmit}>
                                Login
                                    </Button>
                            {/* </Row> */}
                            <Row className="justify-content-md-center">
                                <a style={{ 'color': "darkgray" }} href="./register"> I don't have an account</a>
                            </Row>
                        </Form>
                    </Row>
                </Container>
            </Animate>

        );
    }
}

export default Login;