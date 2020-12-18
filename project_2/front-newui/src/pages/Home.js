import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Animate } from 'react-animate-mount'

import { checkCookie, checkUser, renewToken } from "../components/Cookies";
import cinema_poster from "../assets/cinema.jpg"
class Home extends Component {
    constructor() {
        super();
        this.state = {
            username: checkCookie(),
            role: checkUser(),
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

    componentDidMount() {
        this.setState({ show: true });
        () => renewToken();
    }

    render() {
        return (
            <Animate type='fade' duration="500" show={this.state.show}>
                <div class="relative dark:bg-dark-dark bg-white min-h-full">
                    <div class="max-w-7xl mx-auto">
                        <div class=" min-h-full relative pb-8 dark:bg-dark-dark bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            {/* <svg class=" hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="transparent" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                                <polygon points="50,0 100,0 50,100 0,100" />
                            </svg> */}

                            <div class="relative pt-6 px-4 sm:px-6 lg:px-8">

                            </div>
                            <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div class="sm:text-center lg:text-left">
                                    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span class="block dark:text-indigo-600 xl:inline">Welcome to the</span>
                                        <span class="block text-gray-400 xl:inline">Cinema Db</span>
                                    </h1>
                                    <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        This webapp is part of a project for the course "Services on Cloud and Fog". The project uses mainly
                                        the Flask Framework written in Python for backend and React JS for the frontend. For the UI of this webapp I used the tailwind css and some of
                                        their UI Components. All the movie posters and info are being fetched from <a class="underline" href="https://www.themoviedb.org" target="_blank" >TMDB</a> free to fork this project on GitHub and use it for non-commercial reasons.
                                    </p>
                                    <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div class="rounded-md shadow">
                                            <a href="https://github.com/vskevakis/COMP-518-Cloud-Services" target="_blank" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                                Fork Me
                                            </a>
                                        </div>
                                        <div class="mt-3 sm:mt-0 sm:ml-3">
                                            <a href="https://www.themoviedb.org" target="_blank" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                                                Check TMDB.org
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={cinema_poster} alt="" />
                    </div>
                </div>
            </Animate>
        );
    }
}

export default Home;