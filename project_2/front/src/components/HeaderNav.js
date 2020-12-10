import React, { Component } from 'react';
import { Navbar, Nav, Button, Dropdown, Form, FormControl, Col, Alert, Toast, NavDropdown } from "react-bootstrap"
import { Redirect } from 'react-router-dom';
import logo from '../logo-rev.png'
import io from "socket.io-client";
import { checkCookie, checkUser, checkUserID, setCookie } from './Cookies';
import axios from "axios";


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
            movie_id: "",
            show_not: false,
            notification_list: []
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.fetchNotifications = this.fetchNotifications.bind(this);
        this.handleNotification = this.handleNotification.bind(this);
        this.is_shown = false;
        this.show_not = false;
    }
    // const[notification, setNotification] = userState(0);

    handleLogout(event) {
        setCookie(null, null);
        socket.emit('disconnect');
        this.setState({ username: null, role: null });
    }

    handleNotification(props) {
        const notification_data = {
            "user_id": checkUserID(),
            "movie_id": props
        }
        axios({
            method: 'patch', //you can set what request you want to be
            url: url_prefix + "/data-storage/notification",
            data: notification_data
        }).then(
            (response) => {
                console.log("Notifications Updated")
                console.log(response);
                this.setState({ notification_list: response })
                this.fetchNotifications();
            },
            (error) => {
                console.log("Notifications didn't update");
            }
        );
    }

    componentDidMount() {
        var that = this;
        socket.on('connect', function () {
            // console.log("Socket ID", socket.io.engine.id);     // old ID
            // socket.io.engine.id = checkUserID();
            // console.log("New Socket ID", socket.io.engine.id);     // new ID
            socket.emit('userConnected', checkUserID());
        });
        if (this.state.notification == false) {
            socket.on('notification', function (response) {
                // console.log(this.state.user_id);
                if (response.user_id === checkUserID()) {
                    console.log(response);
                    that.setState({ notification: true });
                    that.setState({ movie_title: response.title.value });
                    that.setState({ movie_id: response.id });
                    // alert("New Notification");
                    console.log("Movie \"" + response.id + "\" has been updated!");
                    that.setState({ notification: false });
                    that.setState({ show_not: true });
                    that.fetchNotifications();
                }
                else {
                    console.log("Not for you dude, its for ", response)
                }
            })
        }
        this.fetchNotifications();

    }

    fetchNotifications = async () => {
        // Fetch missed notifications
        await axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/data-storage/notification?user_id=" + this.state.user_id,
        }).then(
            (response) => {
                console.log("Notifications Updated")
                console.log(response.data);
                this.setState({ notification_list: response.data })
            },
            (error) => {
                console.log("Notifications didn't update");
            }
        );
    }

    render() {
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
        else if (checkUser()) {
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
                        {checkUser() === "Cinema Owner" && <Nav.Link href="/owner">Cinema Owner</Nav.Link>}
                        {checkUser() === "Admin Panel" && <Nav.Link href="/admin">Admin</Nav.Link>}
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        {/* <Toast show={this.state.show_not} onClose={() => this.setState({ show_not: false })}>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded mr-2"
                                    alt=""
                                />
                                <strong className="mr-auto">New notification!</strong>
                                <small>now</small>
                            </Toast.Header>
                            <Toast.Body>Movie "{this.state.movie_title}" has just been updated!</Toast.Body>
                        </Toast> */}
                        {this.state.notification_list.length > 0 &&
                        <Dropdown>
                            <Dropdown.Toggle variant="danger">
                                <i class="fas fa-bell"></i>
                            </Dropdown.Toggle> 
                            <Dropdown.Menu> 
                                {this.state.notification_list.map((notification) => (
                                    <NavDropdown.Item onClick = {() => this.handleNotification(notification.movie_id)}> Movie "{notification.title}" has been updated </NavDropdown.Item>
                                ))}
                            </Dropdown.Menu> 
                        </Dropdown>
                        }
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