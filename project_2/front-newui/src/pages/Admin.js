import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Animate } from 'react-animate-mount'


import { checkCookie, checkUser, getCookie, setCookie } from "../components/Cookies";
import { Movie } from "../components/Movie";



const url_prefix = process.env.REACT_APP_SERVICE_URL;
const app_id = "";

class Admin extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            modalShow: false,
            modal2Show: false,
            edit_user: "",
            users_list: [],
            show: false,
            x_auth_token: ""
        };
        // this.setState = this.setState()
        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    searchUsers = () => {
        const token = { token: getCookie('access_token') };
        const headers = {
            'Content-Type': 'application/json',
        }
        axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/v1/auth/tokens",
            data: token,
            headers: headers
        }).then(
            (response) => {
                console.log(response);
                this.setState({ x_auth_token: response.headers['x-subject-token'] });
                headers = {
                    'X-Auth-token': this.state.x_auth_token,
                    'Content-Type': 'application/json',
                }
                axios({
                    method: 'post', //you can set what request you want to be
                    url: url_prefix + "/applications/" + app_id + "/users",
                    data: null,
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
            },
            (error) => {
                alert("Token expired. Please login again.");
                setCookie(0, 0);
                console.log("Token must have expired");
                console.log(error);
            }
        );
    }

    handleInputChange = (event) => {
        this.setState({
            query: event.target.value
        }, () => {
            this.searchUsers();
        })
    }

    componentDidMount() {
        this.searchUsers();
        this.setState({ show: true });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.modalShow !== this.state.modalShow) {
            this.searchUsers();
        }
        if (prevState.modal2Show !== this.state.modal2Show) {
            this.searchUsers();
        }
    }

    render() {
        return (
            <Animate type="fade" duration="1000" show={this.state.show}>

            </Animate>
        );
    }
}

export default Admin;