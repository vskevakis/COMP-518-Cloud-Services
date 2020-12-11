import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import logo from '../logo-rev.png'
import io from "socket.io-client";
import { checkCookie, checkUser, checkUserID, setCookie, checkToken } from './Cookies';
import axios from "axios";
import DarkMode from "../components/DarkMode";


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
            mobile_menu: false,
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

    handleNotification = (props) => {
        const notification_data = {
            "user_id": checkUserID(),
            "movie_id": props.movie_id
        }
        axios({
            method: 'patch', //you can set what request you want to be
            url: url_prefix + "/data-storage/notification",
            data: notification_data,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("PATCH /notification - SUCCESS")
                this.setState({ notification_list: response.data })
            },
            (error) => {
                console.log("PATCH /notification - FAIL");
            }
        );
    }

    componentDidMount() {
        var that = this;
        // socket.on('connect', function () {
        //     // console.log("Socket ID", socket.io.engine.id);     // old ID
        //     // socket.io.engine.id = checkUserID();
        //     // console.log("New Socket ID", socket.io.engine.id);     // new ID
        //     socket.emit('userConnected', checkUserID());
        // });
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
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("GET /notification - SUCCESS")
                console.log(response.data);
                this.setState({ notification_list: response.data })
                setTimeout(
                    () => this.setState({ show_not: false }),
                    8000
                );
            },
            (error) => {
                console.log("GET /notification - ERROR");
                setTimeout(() => this.setState({
                    notification_list: [
                        {
                            "title": "Rubber",
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg"
                        },
                        {
                            "title": "Rubber",
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg"
                        }
                    ],
                    show_not: true
                }), 4000);
                setTimeout(
                    () => this.setState({ show_not: false }),
                    8000
                );
            }
        );

    }


    render() {
        if (checkUser() === "unconfirmed") {
            return (
                <div></div>
            );
        }
        // else if (checkUser()) {
        else if (true) {
            return (
                <div >
                    <nav class="bg-dark dark:bg-mid-dark min-h-nav max-h-nav">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div class="flex items-center justify-between h-16">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <img class="h-10 w-25" src={logo} alt="the CinemaDb" />
                                    </div>
                                    <div class="hidden md:block">
                                        <div class="ml-10 flex items-baseline space-x-4">
                                            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                            {(window.location.pathname === "/home") && <a href="\home" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</a>}
                                            {(window.location.pathname !== "/home") && <a href="\home" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>}

                                            {(window.location.pathname === "/movies") && <a href="\movies" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Movies</a>}
                                            {(window.location.pathname !== "/movies") && <a href="\movies" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Movies</a>}

                                            {(window.location.pathname === "/owner") && checkUser() === "Cinema Owner" && <a href="\owner" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">My Cinema</a>}
                                            {(window.location.pathname !== "/owner") && checkUser() === "Cinema Owner" && <a href="\owner" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Cinema</a>}

                                            {(window.location.pathname === "/admin") && checkUser() === "Admin" && <a href="\admin" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Admin Panel</a>}
                                            {(window.location.pathname !== "/admin") && checkUser() === "Admin" && <a href="\admin" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Admin Panel</a>}

                                        </div>
                                    </div >
                                </div >
                                <div class="hidden md:block">
                                    <div class="ml-4 flex items-center md:ml-6">
                                        <DarkMode class="focus:none " />
                                        <div class="ml-3 relative">
                                            <button onClick={() => this.setState({ show_not: !this.state.show_not })} class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white ">
                                                <span class="sr-only">View notifications</span>
                                                {/* <!-- Heroicon name: bell --> */}
                                                {this.state.notification_list.length == 0 && <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>}
                                                {this.state.notification_list.length > 0 && <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="tomato" viewBox="0 0 24 24" stroke="white" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>}
                                            </button>
                                            {this.state.show_not && <div class="dark:bg-gray-700 z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    {
                                                        this.state.notification_list.map((notification) => (
                                                            <div class="flex items-center block dark:hover:bg-gray-800 dark:border-black px-4 py-2 text-sm text-gray-700 rounded-t-md hover:bg-gray-100 hover:text-gray-900 border-b-2 border-gray-200">
                                                                <div class="flex-shrink-0 h-10 w-10">
                                                                    <img class="h-10 w-10 rounded-full" src={notification.poster_path} alt="" />
                                                                </div>
                                                                <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-gray-100" role="menuitem">"{notification.title}" has been updated</a>
                                                                <button class="h-10 w-10 hover:bg-gray-300 dark:hover:bg-gray-900 rounded-full" onClick={() => this.handleNotification(notification)}><i class="fas fa-check-double dark:text-gray-400"></i></button>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            }
                                        </div>
                                        <a class="text-md px-4 py-2 text-white ">username</a>
                                        <div class="dark:bg-gray-300 rounded-md shadow-lg py-1 bg-gray-200 ring-1 ring-black ring-opacity-5">
                                            <a href="/login" onClick={() => this.handleLogout()} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="-mr-2 flex md:hidden">
                                    {/* <!-- Mobile menu button --> */}
                                    <button onClick={() => this.setState({ mobile_menu: !this.state.mobile_menu })} class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <span class="sr-only">Open main menu</span>

                                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>

                                        <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div >
                        </div >

                        {
                            this.state.mobile_menu && <div class="lg:hidden">
                                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                    {(window.location.pathname === "/home") && <a href="\home" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</a>}
                                    {(window.location.pathname !== "/home") && <a href="\home" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>}

                                    {(window.location.pathname === "/movies") && <a href="\movies" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Movies</a>}
                                    {(window.location.pathname !== "/movies") && <a href="\movies" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Movies</a>}

                                    {(window.location.pathname === "/owner") && checkUser() === "Cinema Owner" && <a href="\owner" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">My Cinema</a>}
                                    {(window.location.pathname !== "/owner") && checkUser() === "Cinema Owner" && <a href="\owner" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Cinema</a>}

                                    {(window.location.pathname === "/admin") && checkUser() === "Admin" && <a href="\admin" class="bg-gray-900 text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Admin Panel</a>}
                                    {(window.location.pathname !== "/admin") && checkUser() === "Admin" && <a href="\admin" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Admin Panel</a>}

                                </div>
                                <div class="pt-4 pb-3 border-t border-gray-700">
                                    <div class="flex items-center px-5">
                                        <div class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <button onClick={() => this.handleLogout()}>Sign out</button>
                                        </div>
                                        <button onClick={() => this.setState({ show_not: !this.state.show_not })} class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <span class="sr-only">View notifications</span>
                                            {/* <!-- Heroicon name: bell --> */}
                                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                        </button>
                                        {this.state.show_not && <div class="origin-mid-center  z-10  absolute center-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                {
                                                    this.state.notification_list.map((notification) => (
                                                        <div href="#" class="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                                            <div class="flex-shrink-0 h-10 w-10">
                                                                <img class="h-10 w-10 rounded-full" src={notification.poster_path} alt="" />
                                                            </div>
                                                            <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Movie "{notification.title}" has been updated</a>
                                                            <button onClick={() => this.handleNotification(notification)}>Mark as read</button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </nav >
                </div >
            );
        }
        else {
            return <Redirect to="/login" />;
        }
    }
}

export default HeaderNav;