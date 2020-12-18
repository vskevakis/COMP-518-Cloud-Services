import React, { Component, useState } from "react";
import { Redirect } from "react-router-dom";
import { Animate } from 'react-animate-mount'
import DarkMode from "../components/DarkMode";

import logo from '../logo.png';
import logo_rev from '../logo-rev.png';

import axios from "axios";

import { checkUser, checkCookie, setCookie } from "../components/Cookies";

const base64key = process.env.REACT_APP_BASE64_AUTH;
const url_prefix = process.env.REACT_APP_SERVICE_URL;
class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            isAuthenticated: checkUser(),
            mode: localStorage.getItem("theme"),
            show: false

        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // check it out: we get the event.target.name (which will be either "username" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidMount() {
        this.setState({ show: true })
        console.log(base64key)
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const user_data = 'grant_type=password&username=' + this.state.email + '&password=' + this.state.password
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
                setCookie(response.data.access_token, response.data.refresh_token);
                this.setState({ isAuthenticated: true });
            },
            (error) => {
                setCookie(null, null);
                console.log(error);
            }
        );
    };

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to="/home" />;
        }
        return (
            <Animate type='fade' duration="500" show={this.state.show}>

                <div class="min-h-screen dark:bg-gray-900 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div class=" max-w-md w-full space-y-8">
                        <div>
                            {localStorage.getItem("theme") === "dark" && <img class="mx-auto h-40 w-auto" src={logo_rev} alt="Workflow" />}
                            {localStorage.getItem("theme") === "light" && <img class="mx-auto h-40 w-auto" src={logo} alt="Workflow" />}
                            {/* <img class="visible dark:invisible mx-auto h-40 w-auto dark:shadow-2xl" src={logo} alt="Workflow" /> */}
                            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-400">
                                Sign in to your account
                            </h2>
                            <p class="mt-2 text-center text-sm text-gray-600">
                                or <br />
                                <a href="/idm" class="font-medium text-indigo-600 hover:text-indigo-500">
                                    register via Keyrock IDM
                                </a>
                            </p>
                        </div>
                        <form onSubmit={this.handleSubmit} class="mt-8 space-y-6" action="" method="POST">
                            <input type="hidden" name="remember" value="true" />
                            <div class="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label for="email-address" class="sr-only">Email address</label>
                                    <input id="email-address" name="email" type="email" onChange={this.handleChange} autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-gray-400 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
                                </div>
                                <div>
                                    <label for="password" class="sr-only">Password</label>
                                    <input id="password" name="password" type="password" onChange={this.handleChange} autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 dark:border-gray-900 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-900 dark:bg-gray-800" />
                                    <label for="remember_me" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                                        Remember me
                                    </label>
                                </div>

                                <div class="text-sm">
                                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button onClick={this.handleSubmit} type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                    Sign in
                                </button>
                            </div>
                            <div class="flex justify-center" > <DarkMode /> </div>
                        </form>
                    </div>
                </div>


            </Animate>

        );
    }
}

export default Login;