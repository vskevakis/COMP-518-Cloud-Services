import React from 'react';
import { Navbar, Nav, Button, Form, FormControl, Col } from "react-bootstrap"
import { Redirect } from 'react-router-dom';
import logo from '../logo.png'
import { checkCookie, checkUser, setCookie } from './Cookies';

import { Logout } from '../pages/Logout';

export default class HeaderNav extends React.Component {
    constructor() {
        super();
        this.state = {
            username: checkCookie(),
            role: checkUser(),
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        setCookie("token", null);
        this.setState({ username: null, role: null });
    }

    render() {
        if (this.state.username == null) {
            return <Redirect to="/login" />;
        }
        if (checkUser() == "user") {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home"><img
                        alt=""
                        src={logo}
                        width="100"
                        height="80"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="#features">Now Playing</Nav.Link>
                        <Nav.Link href="#pricing">Cinemas</Nav.Link>
                    </Nav>
                    <Form className="mr-auto" inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-info">Search</Button>
                    </Form>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                    <Button className="logout-but" onClick={this.handleLogout}>Logout</Button>
                </Navbar>
            );
        }
        else if (checkUser() == "cinemaowner") {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home"><img
                        alt=""
                        src={logo}
                        width="100"
                        height="80"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="#features">Now Playing</Nav.Link>
                        <Nav.Link href="#pricing">Cinemas</Nav.Link>
                        <Nav.Link href="#pricing">My Cinema</Nav.Link>
                    </Nav>
                    <Form className="mr-auto" inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-info">Search</Button>
                    </Form>
                    <Button className="logout-but" onClick={this.handleLogout}>Logout</Button>
                </Navbar>
            );
        }
        else if (checkUser() == "admin") {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home"><img
                        alt=""
                        src={logo}
                        width="100"
                        height="80"
                        className="d-inline-block align-top"
                    />{' '}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/movies">Home</Nav.Link>
                        <Nav.Link href="/movies">Now Playing</Nav.Link>
                        <Nav.Link href="/owner">Cinema Owner</Nav.Link>
                        <Nav.Link href="/admin">Admin User</Nav.Link>
                    </Nav>
                    {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
                        </Form> */}
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="#login">{this.state.username}</a>
                        </Navbar.Text>
                        <Button className="logout-but" onClick={this.handleLogout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar >
            );
        }
        else {
            return <Redirect to="/login" />;

        }
    }
}