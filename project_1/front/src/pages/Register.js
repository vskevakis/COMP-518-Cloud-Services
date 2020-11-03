import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";

import { checkCookie, setCookie } from "../components/Cookies";

import background1 from '../assets/backgrounds/background-movie-2.jpg';
import background2 from '../assets/backgrounds/background-movie-3.jpg';
import background3 from '../assets/backgrounds/background-movie-6.jpg';
import background4 from '../assets/backgrounds/background-movie-7.jpg';
import background5 from '../assets/backgrounds/background-movie-8.jpg';
import login_image from '../assets/illustrations/home_cinema_login.svg';

const url = process.env.REACT_APP_SERVICE_URL;

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
            user_role: "",
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
            name: this.state.name,
            surname: this.state.surname,
            user_role: this.state.user_role,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            isAuthenticated: false,
        };

        console.log(user_data);

        await axios.post(url + "/auth/register", user_data).then(
            (response) => {
                setCookie("token", response.data);
                this.setState({ isAuthenticated: true });
            },
            (error) => {
                alert("Registration Unsuccesful. Please check your credentials.");
            }
        );
        this.setState({ username: "", email: "", password: "", name: "", surname: "", user_role: "" });
    };

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to="/movies" />;
        }
        return (
            <div style={this.state.bgStyle} className="full-page-div bg">
                <Container className="container">
                    <Row className="my-form">
                        <Col className="login_image">
                            <img height="400px" src={login_image}></img>
                        </Col>
                        <Col>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Row className="justify-content-md-center">
                                    <h3>Sign Up</h3>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formBasicUsername">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="John"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formBasicUsername">
                                        <Form.Label>Surname</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="surname"
                                            placeholder="Doe"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formBasicUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="johndoe"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="password"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="jdoe@email.com"
                                        onChange={this.handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Select Role</Form.Label>
                                    <Form.Control as="select">
                                        <option onClick={() => this.setState({ user_role: 'User' })}>User</option>
                                        <option onClick={() => this.setState({ user_role: 'Cinema Owner' })}>Cinema Owner</option>
                                        <option onClick={() => this.setState({ user_role: 'Admin' })}>Admin</option>
                                    </Form.Control>
                                </Form.Group>
                                <Row className="justify-content-md-center">
                                    <Button as={Col} variant="primary" type="submit" onClick={this.handleSubmit}>
                                        Register
                            </Button>
                                </Row>
                                <Row className="justify-content-md-center">
                                    <a href="./login"> I already have an account</a>
                                </Row>
                            </Form>
                        </Col>
                    </Row >
                </Container>
            </div>
        );
    }
}

export default Register;