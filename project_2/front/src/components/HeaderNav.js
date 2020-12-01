import React from 'react';
import { Navbar, Nav, Button, Form, FormControl, Col } from "react-bootstrap"
import { Redirect } from 'react-router-dom';
import logo from '../logo-rev.png'
import { checkCookie, checkUser, setCookie } from './Cookies';

import { Logout } from '../pages/Logout';

export default class HeaderNav extends React.Component {
    constructor() {
        super();
        this.state = {
            username: checkCookie(),
            role: checkUser(),
            is_shown: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.is_shown = false;
    }

    handleLogout(event) {
        setCookie("token", null);
        this.setState({ username: null, role: null });
    }

    render() {
        if (this.state.username == null) {
            return <Redirect to="/login" />;
        }
        if (checkUser() === "unconfirmed") {
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
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button variant="light" className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar >
            );
        }
        else if (checkUser() === "User") {
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