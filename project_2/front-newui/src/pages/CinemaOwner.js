import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
// import DatePicker from "../components/Datepicker";
import moment from "moment";
import { Animate } from 'react-animate-mount'
import { DeleteMovieModal, AddMovieModal, EditMovieModal, AddCinemaModal, DeleteCinemaModal } from '../components/Modals'

import { renewToken, checkToken, checkUserID } from "../components/Cookies";
import io from "socket.io-client";

const socket = io.connect();
const url_prefix = process.env.REACT_APP_SERVICE_URL;

class CinemaOwner extends Component {
    constructor() {
        super();
        this.state = {
            user_id: checkUserID(),
            query: '',
            cinema: '',
            date: '',
            editModalShow: false,
            addModalShow: false,
            deleteModalShow: false,
            addCinemaModalShow: false,
            deleteCinemaModalShow: false,
            edit_movie: "",
            deleteMovie: false,
            movies_list: [],
            cinemas_list: [],
            showCinemaList: false,
            show: false
        };
        // this.setState = this.setState()
        // this.handleInputChange = this.handleInputChange.bind(this);
    }
    formatter = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
    });

    searchMovies = () => {
        if (this.state.cinema !== "") {
            axios({
                method: 'get', //you can set what request you want to be
                url: url_prefix + "/data-storage/movies?cinema_name=" + this.state.cinema + "&search=" + this.state.query + "&date=" + this.state.date,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': checkToken()
                }
            }).then(
                (response) => {
                    console.log("GET /movies - SUCCESS");
                    this.setState({ movies_list: response.data });
                },
                (error) => {
                    console.log("GET /movies - ERROR");
                    this.setState({ movies_list: [] });
                }
            );
        }
    }

    fetchCinemas = () => {
        axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/data-storage/cinemas?user_id=" + this.state.user_id,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("GET /cinemas - SUCCESS");
                this.setState({ cinemas_list: response.data });
            },
            (error) => {
                console.log("GET /cinemas - ERROR");
                // this.setState({
                //     cinemas_list: [
                //         { cinema_name: "Attikon" },
                //         { cinema_name: "Ellinis" },
                //         { cinema_name: "Megaplace" }
                //     ]
                // });
            }
        );
    }

    handleInputChange = (event) => {
        this.setState({
            query: event.target.value
        }, () => {
            this.searchMovies();
        })
    }



    componentDidMount() {
        this.fetchCinemas();
        this.searchMovies();
        this.setState({ show: true });
        socket.on('notification', () => {
            this.searchMovies();
        });
        () => renewToken();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cinema !== this.state.cinema) {
            this.searchMovies();
        }
        if (prevState.deleteCinemaModalShow !== this.state.deleteCinemaModalShow) {
            this.fetchCinemas();
            this.searchMovies();
        }
        if (prevState.editModalShow !== this.state.editModalShow) {
            this.searchMovies();
        }
        if (prevState.addModalShow !== this.state.addModalShow) {
            this.searchMovies();
        }
        if (prevState.deleteModalShow !== this.state.deleteModalShow) {
            this.searchMovies();
        }
        if (prevState.addCinemaModalShow !== this.state.addCinemaModalShow) {
            this.fetchCinemas();
        }
    }

    handleDateChange = (event) => {
        this.setState({
            date: event.target.value
        }, () => {
            this.searchMovies();
        })
    }

    render() {
        // if (checkUser() !== "Cinema Owner" && checkUser() !== "Cinema Owner") {
        //     return <Redirect to="/home" />;
        // }
        return (
            <Animate type="fade" duration="1000" show={this.state.show}>
                {/* <div class="dark:bg-black min-h-screen max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> */}
                <div class="flex flex-auto justify-center bg-light dark:bg-dark-dark">
                    <div class="my-5 align-middle inline-block max-w-1 sm:px-6 lg:px-10">
                        <div class="pt-2 pb-2 border-b border-gray-900  dark:border-gray-400 center" inline>
                            <input class="bg-transparent border-t-0 border-r-0 border-l-0" onChange={this.handleInputChange} type="text" placeholder="Search" />
                            <input class="bg-transparent dark:text-gray-400 border-t-0 border-r-0 border-l-0" type="date" value={this.state.date} onChange={this.handleDateChange}></input>
                        </div>
                    </div>
                    {/* Cinema Select Dropdown */}
                    <div class="my-4 pt-2 pb-2 border-gray-900  dark:border-gray-400 center">
                        <div class="relative">
                            <button onClick={() => this.setState({ showCinemaList: !this.state.showCinemaList })} type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">

                                <div>
                                    <span class="flex items-center">
                                        <span class="ml-3 block truncate">
                                            {this.state.cinema ? this.state.cinema : "Select Cinema"}
                                        </span>
                                    </span>
                                    <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                </div>

                            </button>
                            {this.state.showCinemaList && <div class="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                                <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {
                                        this.state.cinemas_list.map((cinema) => (

                                            <li onClick={() => this.setState({ showCinemaList: !this.state.showCinemaList })} id="listbox-item-0" role="option" class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">
                                                <div class="flex items-center">
                                                    <span onClick={() => this.setState({ cinema: cinema.cinema_name })} class="ml-3 block font-normal truncate">
                                                        {cinema.cinema_name}
                                                    </span>
                                                </div>

                                                <span class="absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                    </svg>
                                                </span>
                                            </li>

                                        ))
                                    }
                                    <li onClick={() => this.setState({ showCinemaList: !this.state.showCinemaList })} id="listbox-item-0" role="option" class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">
                                        <div class="flex items-center">
                                            <span onClick={() => this.setState({ addCinemaModalShow: true })} class="ml-3 block font-normal truncate">
                                                New Cinema
                                                    </span>
                                        </div>
                                        <span class="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" clip-rule="evenodd" />
                                            </svg>
                                        </span>
                                    </li>
                                </ul>
                            </div>}

                        </div>
                    </div>

                </div>
                { this.state.cinemas_list.length > 0 && <div class="bg-sm dark:bg-dark-dark min-h-full py-6 sm:px-6 lg:px-8">
                    <div class="flex flex-col">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Movie
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Start Date
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    End Date
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark dark:text-gray-200">
                                                    <span class="sr-only">Edit</span>
                                                </th>
                                                <th scope="col" class="px-6 py-3 bg-gray-50 dark:bg-mid-dark ">
                                                    <a href="#" class="mx-2" onClick={() => this.setState({ addModalShow: true })} class="text-indigo-600 hover:text-indigo-900">Add Movie</a>
                                                    <a href="#" class="mx-2" onClick={() => this.setState({ deleteCinemaModalShow: true })} class="text-indigo-600 hover:text-indigo-900">Delete Cinema</a>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-900">
                                            {
                                                this.state.movies_list.map((movie) => (
                                                    <tr class="dark:bg-light-dark">
                                                        <td class="px-6 py-4 whitespace-nowrap ">
                                                            <div class="flex items-center">
                                                                <div class="flex-shrink-0 h-10 w-10">
                                                                    <img class="h-10 w-10 rounded-full" src={movie.poster_path} alt="" />
                                                                </div>
                                                                <div class="ml-4">
                                                                    <div class="text-sm font-medium text-gray-900">
                                                                        {movie.title}
                                                                    </div>
                                                                    <div class="text-sm text-gray-500">
                                                                        {movie.movie_id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap">
                                                            <div class="text-sm text-gray-900">{movie.category}</div>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap">
                                                            {movie.start_date <= moment().format('YYYY-MM-DD') && movie.end_date >= moment().format('YYYY-MM-DD') && <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Active
                                                            </span>}
                                                            {movie.end_date < moment().format('YYYY-MM-DD') && <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Archived
                                                            </span>}
                                                            {movie.start_date > moment().format('YYYY-MM-DD') && <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Scheduled
                                                            </span>}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {this.formatter.format(Date.parse(movie.start_date))}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {this.formatter.format(Date.parse(movie.end_date))}
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
                                                            <a href="#" onClick={() => this.setState({ editModalShow: true, edit_movie: movie })} class="text-indigo-600  dark:text-gray-600 hover:text-indigo-900">Edit</a>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <a href="#" onClick={() => this.setState({ deleteModalShow: true, edit_movie: movie })} class="text-indigo-600 dark:text-gray-600 hover:text-indigo-900">Delete</a>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>

                                    </table>
                                    {
                                        this.state.movies_list.length == 0 &&
                                        <div class="flex flex-auto justify-center bg-light dark:bg-dark-dark">
                                            <div class="my-5 align-middle inline-block max-w-1 sm:px-6 lg:px-10">
                                                <div class="pt-2 pb-2 center" inline>
                                                    <h2 class="bg-transparent dark:text-gray-300">No Movies Found</h2>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.state.deleteModalShow && <DeleteMovieModal
                    onHide={() => this.setState({ deleteModalShow: false })}
                    movie={this.state.edit_movie}
                    cinema={this.state.cinema}
                />}
                {this.state.editModalShow && <EditMovieModal
                    onHide={() => this.setState({ editModalShow: false })}
                    movie={this.state.edit_movie}
                    cinema={this.state.cinema}
                />}
                {this.state.addModalShow && <AddMovieModal
                    onHide={() => this.setState({ addModalShow: false })}
                    movie={this.state.edit_movie}
                    cinema={this.state.cinema}
                />}
                {this.state.addCinemaModalShow && <AddCinemaModal
                    onHide={() => this.setState({ addCinemaModalShow: false })}
                />}
                {this.state.deleteCinemaModalShow && <DeleteCinemaModal
                    onHide={() => this.setState({ deleteCinemaModalShow: false })}
                    cinema={this.state.cinema}
                    user_id={this.state.user_id}
                />}
            </Animate>
        );
    }
}

export default CinemaOwner;