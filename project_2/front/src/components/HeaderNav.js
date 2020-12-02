import React, { Component } from 'react';
import { Navbar, Nav, Button, Form, FormControl, Col, Alert } from "react-bootstrap"
import { Redirect } from 'react-router-dom';
import logo from '../logo-rev.png'
import io from "socket.io-client";
import { checkCookie, checkUser, checkUserID, setCookie } from './Cookies';

import { Logout } from '../pages/Logout';
const url_prefix = process.env.REACT_APP_SERVICE_URL;
const socket = io.connect();

class HeaderNav extends Component {
    constructor() {
        super();
        this.state = {
            username: checkCookie(),
            role: checkUser(),
            is_shown: false,
            user_id: checkUserID(),
            notification: false,
            movie_title: "",
            show_not: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.is_shown = false;
        this.show_not = false;
    }
    // const[notification, setNotification] = userState(0);

    handleLogout(event) {
        setCookie("token", null);
        socket.emit('disconnect');
        this.setState({ username: null, role: null });
    }

    // handleSocket() {
    //     socket.on('connect', function () {
    //         console.log("Socket ID", socket.io.engine.id);     // old ID
    //         socket.io.engine.id = checkUserID();
    //         console.log("New Socket ID", socket.io.engine.id);     // new ID
    //     });
    //     socket.on('notification', function (response) {
    //         console.log("Notification: ", response);
    //         // console.log(this.state.user_id);
    //         this.setState(() => { notification: true });
    //     })
    // }
    componentDidMount() {
        var that = this;
        socket.on('connect', function () {
            // console.log("Socket ID", socket.io.engine.id);     // old ID
            // socket.io.engine.id = checkUserID();
            // console.log("New Socket ID", socket.io.engine.id);     // new ID
            socket.emit('userConnected', checkUserID());
        });
        if (this.state.notification == false)
            socket.on('notification', function (response) {
                // console.log(this.state.user_id);
                if (response.user_id === checkUserID()) {
                    that.setState({ notification: true });
                    that.setState({ movie_title: response.title.value });
                    // alert("New Notification");
                    console.log("Movie \"" + response.title.value + "\" has been updated!");
                    that.setState({ notification: false });
                    that.setState({ show_not: true });
                }
                else {
                    console.log("Not for you dude, its for ", response)
                }
            })
    }

    // componentDidUpdate() {
    //     var that = this;
    //     socket.on('notification', function (response) {
    //         console.log("Update Notification: ", response);
    //         that.setState({ notification: true });
    //     })
    // }


    render() {
        if (this.state.username == null) {
            return <Redirect to="/login" />;
        }
        if (checkUser() === "unconfirmed") {
            return (
                <Navbar Navbar bg="black" variant="dark" >
                    <Navbar.Brand href="/home"><img
                        alt=""
                        src={logo}
                        width="120"
                        height="auto"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button variant="light" className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>
            );
        }
        else if (checkUser() === "User") {
            // this.handleSocket()
            return (
                <Navbar bg="black" variant="dark">
                    <Navbar.Brand href="/home"><img
                        alt=""
                        src={logo}
                        width="120"
                        height="auto"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/movies">Movies</Nav.Link>
                    </Nav>
                    <Alert show={this.state.show_not} variant="success">
                        <Alert.Heading>New notification!</Alert.Heading>
                        <p>
                            Movie {this.state.movie_title} has just been updated!
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({ show_not: false })} variant="outline-success">
                                Close me y'all!
                    </Button>
                        </div>
                    </Alert>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button variant="light" className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar >
            );
        }
        else if (checkUser() === "Cinema Owner") {
            // this.handleSocket()
            return (
                <Navbar bg="black" variant="dark">
                    <Navbar.Brand href="/home"><img
                        alt=""
                        src={logo}
                        width="120"
                        height="auto"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/movies">Movies</Nav.Link>
                        <Nav.Link href="/owner">My Cinema</Nav.Link>
                    </Nav>

                    <Alert show={this.state.show_not} variant="success">
                        <Alert.Heading>New notification!</Alert.Heading>
                        <p>
                            Movie {this.state.movie_title} has just been updated!
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({ show_not: false })} variant="outline-success">
                                Close me y'all!
                    </Button>
                        </div>
                    </Alert>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button variant="light" className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar >
            );
        }
        else if (checkUser() === "Admin") {
            // this.handleSocket()
            return (
                <Navbar bg="black" variant="dark">
                    <Navbar.Brand href="/home"><img
                        alt=""
                        src={logo}
                        width="120"
                        height="auto"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/movies">Movies</Nav.Link>
                        <Nav.Link href="/admin">Admin Panel</Nav.Link>
                    </Nav>
                    {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
                        </Form> */}

                    <Alert show={this.state.show_not} variant="success">
                        <Alert.Heading>New notification!</Alert.Heading>
                        <p>
                            Movie {this.state.movie_title} has just been updated!
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({ show_not: false })} variant="outline-success">
                                Close me y'all!
                    </Button>
                        </div>
                    </Alert>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button variant="light" className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar >
            );
        }
        else {
            return <Redirect to="/login" />;

        }
    }
}

export default HeaderNav;