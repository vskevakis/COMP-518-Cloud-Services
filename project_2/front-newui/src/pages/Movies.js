import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Animate } from 'react-animate-mount'
import io from "socket.io-client";


import { checkCookie, checkUser, setCookie, checkUserID, checkToken } from "../components/Cookies";
import { Movie } from "../components/Movie";
import SearchBar from "../components/SearchBar";
const url_prefix = process.env.REACT_APP_SERVICE_URL;
const socket = io.connect();

class Movies extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            date: moment().format('YYYY-MM-DD'),
            update: false,
            user_id: checkUserID(),
            movies_list: [],
            fav_list: [],
            favs_only: false,
            show: false,
            notification: false
            // items: 10,
        };
    }


    searchMovies = () => {
        /* Fetching Favourites */
        axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/data-storage/favourites?user_id=" + this.state.user_id,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("Favs Initialized");
                const fav_list = response.data;
                this.setState({ fav_list: fav_list });
            },
            (error) => {
                const fav_list = []
                this.setState({ fav_list: fav_list });
                console.log("Fav List", fav_list);
            }
        );
        /* Fetching Movies with search arguments */
        axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies?search=" + this.state.query + "&date=" + this.state.date,
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

    componentDidMount() {
        this.searchMovies();
        this.setState({ show: true });
    }

    handleInputChange = (event) => {
        this.setState({
            query: event.target.value
        }, () => {
            this.searchMovies();
        })
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
            <Animate type='fade' duration="1000" show={this.state.show}>
                <div class="flex flex-auto justify-center bg-light dark:bg-dark-dark">
                    <div class="my-5 align-middle inline-block max-w-1 sm:px-6 lg:px-10">
                        <div class="pt-2 pb-2 border-b border-gray-900  dark:border-gray-400 center" inline>
                            <input class="bg-transparent border-t-0 border-r-0 border-l-0" onChange={this.handleInputChange} type="text" placeholder="Search" />
                            <input class="bg-transparent dark:text-gray-400 border-t-0 border-r-0 border-l-0" type="date" value={this.state.date} onChange={this.handleDateChange}></input>
                        </div>
                        <div class="pt-2 pb-2 dark:text-gray-400" >
                            {this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} ><i class="far fa-check-square"></i> Only Favourites</button>}
                            {!this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} ><i class="far fa-square"></i> Only Favourites</button>}
                        </div>
                    </div>
                </div>
                <main class="bg-light dark:bg-dark-dark min-h-full ">
                    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div class="px-4 py-6 sm:px-0">
                            <ul class=" align-middle grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {this.state.movies_list.map((movie) => (
                                    <Movie
                                        movies={movie}
                                        favs={this.state.fav_list}
                                        onFavUpdate={() => this.setState({ update: !this.state.update })}
                                        favsOnly={this.state.favs_only}>

                                    </Movie>
                                ))}
                            </ul>
                            {
                                this.state.movies_list.length == 0 &&
                                <div class="flex flex-auto justify-center bg-light dark:bg-dark-dark">
                                    <div class="my-5 align-middle inline-block max-w-1 sm:px-6 lg:px-10">
                                        <div class="pt-2 pb-2 border-b border-gray-900  dark:border-gray-400 center" inline>
                                            <h2 class="bg-transparent border-t-0 border-r-0 border-l-0">No Movies Found</h2>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {/* <!-- /End replace --> */}
                    </div>
                </main>
            </Animate >
        );
    }
}

export default Movies;