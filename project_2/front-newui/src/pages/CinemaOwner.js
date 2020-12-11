import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
// import DatePicker from "../components/Datepicker";
import moment from "moment";
import { Animate } from 'react-animate-mount'
import { DeleteMovieModal, AddMovieModal, EditMovieModal } from '../components/Modals'

import { checkCookie, checkUser, setCookie, checkToken } from "../components/Cookies";



const url_prefix = process.env.REACT_APP_SERVICE_URL;

class CinemaOwner extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            cinema: checkCookie(),
            date: '',
            editModalShow: false,
            addModalShow: false,
            deleteModalShow: false,
            edit_movie: "",
            deleteMovie: false,
            movies_list: [],
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
        const search_query = {
            cinema: this.state.cinema,
            search: this.state.query,
            date: this.state.date
        };
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

    handleInputChange = (event) => {
        this.setState({
            query: event.target.value
        }, () => {
            this.searchMovies();
        })
    }



    componentDidMount() {
        this.searchMovies();
        this.setState({ show: true })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.editModalShow !== this.state.editModalShow) {
            this.searchMovies();
        }
        if (prevState.addModalShow !== this.state.addModalShow) {
            this.searchMovies();
        }
        if (prevState.deleteModalShow !== this.state.deleteModalShow) {
            this.searchMovies();
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
                </div>
                <div class="bg-sm dark:bg-dark-dark min-h-full py-6 sm:px-6 lg:px-8">
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
                                                    <a href="#" onClick={() => this.setState({ addModalShow: true })} class="text-indigo-600 hover:text-indigo-900">Add Movie</a>
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
                { this.state.deleteModalShow && <DeleteMovieModal
                    onHide={() => this.setState({ deleteModalShow: false })}
                    movie={this.state.edit_movie}
                />}
                { this.state.editModalShow && <EditMovieModal
                    onHide={() => this.setState({ editModalShow: false })}
                    movie={this.state.edit_movie}
                />}
                { this.state.addModalShow && <AddMovieModal
                    onHide={() => this.setState({ addModalShow: false })}
                    movie={this.state.edit_movie}
                />}
            </Animate>
        );
    }
}

export default CinemaOwner;