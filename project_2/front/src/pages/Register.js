import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import { Animate } from 'react-animate-mount'

import { checkCookie, setCookie, checkUser } from "../components/Cookies";

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

const base64key = "MDJiMjEzZTctZjYyNy00YWI1LTlhZmItODg2ZjhlODllNzU2OjViMTdmODA2LWYzN2ItNDgwNC1hNzJkLWUwYzI1NmUxZjI1Mg=="
const url_prefix = process.env.REACT_APP_SERVICE_URL;

class Register extends Component {
    constructor() {
        super();
        this.state = {
            bgStyle: {
                height: "100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            },
            name: "",
            surname: "",
            username: "",
            password: "",
            email: "",
            user_role: "user",
            isAuthenticated: "",
            show: false,
            x_auth_token: ""
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

        const admin_data = {
            name: "admin@test.com",
            password: "1234"
        }

        const user_data = {
            description: this.state.user_role,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,

        };

        const user_data_str = 'grant_type=password&username=' + this.state.email + '&password=' + this.state.password

        const headers = {
            'Content-Type': 'application/json',
        }
        await axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/idm/v1/auth/tokens",
            data: admin_data,
            headers: headers
        }).then(
            (response) => {
                console.log(response);
                this.setState({ x_auth_token: response.headers['x-subject-token'] });
                /* Call Create User API */
                console.log(this.state.x_auth_token);
                const headers2 = {
                    'X-Auth-token': this.state.x_auth_token,
                    'Content-Type': 'application/json',
                }
                axios({
                    method: 'post', //you can set what request you want to be
                    url: url_prefix + "/idm/v1/users",
                    data: { user: user_data },
                    headers: headers2
                }).then(
                    (response) => {
                        console.log(response);
                        /* Get a token for the user */
                        const headers3 = {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + base64key //+ base64(client_id: client_secret);
                        }
                        axios({
                            method: 'post', //you can set what request you want to be
                            url: url_prefix + "/idm/oauth2/token",
                            data: user_data_str,
                            headers: headers3
                        }).then(
                            (response) => {
                                console.log(response);
                                setCookie(response.data.access_token, response.data.refresh_token);
                                this.setState({ isAuthenticated: true });
                            },
                            (error) => {
                                console.log("You failed AGAIN");
                                console.log(error);
                                return;
                            }
                        );
                    },
                    (error) => {
                        console.log("You failed Here");
                        console.log(error);
                        return;
                    }
                );
            },
            (error) => {
                console.log("You failed AGAIN");
                console.log(error);
                return;
            }
        );

    };

    render() {
        if (checkUser()) {
            return <Redirect to="/home" />;
        }
        return (
            <Animate type='fade' duration="500" show={this.state.show}>
                <Container fluid style={this.state.bgStyle} className="full-page-div bg">
                    <Row className="justify-content-md-center">
                        <img className="logo" src={logo}></img>
                    </Row>
                    <Row className="justify-content-md-center my-form">
                        <Form className="my-form" onSubmit={this.handleSubmit}>
                            <Form.Row className="justify-content-md-center">
                                <h3>Sign Up</h3>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formBasicUsername">
                                    {/* <Form.Label>First Name</Form.Label> */}
                                    <Form.Control
                                        className="my-form"
                                        type="text"
                                        name="name"
                                        placeholder="First Name"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formBasicUsername">
                                    {/* <Form.Label>Surname</Form.Label> */}
                                    <Form.Control
                                        className="my-form"
                                        type="text"
                                        name="surname"
                                        placeholder="Surname"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formBasicUsername">
                                    {/* <Form.Label>Username</Form.Label> */}
                                    <Form.Control
                                        className="my-form"
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formBasicPassword">
                                    {/* <Form.Label>Password</Form.Label> */}
                                    <Form.Control
                                        className="my-form"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formBasicEmail">
                                    {/* <Form.Label>Email</Form.Label> */}
                                    <Form.Control
                                        className="my-form"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        onChange={this.handleChange}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                this.handleSubmit(event)
                                            }
                                        }}
                                    />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                    </Form.Text>
                                </Form.Group>
                                <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
                                    {/* <Form.Label>Select Role</Form.Label> */}
                                    <Form.Control className="my-form" as="select">
                                        <option onClick={() => this.setState({ user_role: 'User' })}>User</option>
                                        <option onClick={() => this.setState({ user_role: 'Cinema Owner' })}>Cinema Owner</option>
                                        <option onClick={() => this.setState({ user_role: 'Admin' })}>Admin</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Button as={Col} variant="dark" type="submit" onClick={this.handleSubmit}>
                                Register
                            </Button>
                            <Row className="justify-content-md-center">
                                <a style={{ 'color': "darkgray" }} href="./login"> I already have an account</a>
                            </Row>
                        </Form>
                    </Row >
                </Container>
            </Animate>
        );
    }
}

export default Register;