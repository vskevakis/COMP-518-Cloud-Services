import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";
import DatePicker from "../components/Datepicker";
import moment from "moment";

import { checkCookie, checkUser, setCookie, checkUserID } from "../components/Cookies";
import { Movie } from "../components/Movie";
import { SearchMovie } from "../components/SearchMovie";
import InfiniteScroll from 'react-infinite-scroll-component';
const url = process.env.REACT_APP_SERVICE_URL;

class Movies extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            date: moment().format('YYYY-MM-DD'),
            update: false,
            user_id: checkUserID(),
            // setDate: moment(),
            // username: checkCookie(),
            // role: checkUser(),
            // isAuthenticated: checkCookie(),
            movies_list: [],
            chunk: [],
            index: 0,
            fav_list: [],
            favs_only: false,
            hasMore: true
        };
        // this.setState = this.setState()
        // this.handleInputChange = this.handleInputChange.bind(this);
    }


    searchMovies = () => {
        const search_query = {
            search: this.state.query,
            date: this.state.date,
        };
        const user_id = {
            user_id: this.state.user_id
        }
        axios.post(url + `/back/get_favs`, user_id)
            .then(res => {
                console.log("Favs Initialized");
                console.log(user_id)
                // console.log(res.data.movies_list);
                const fav_list = res.data;
                this.setState({ fav_list: fav_list });
            },
                err => {
                    const fav_list = [4, 35, 1]
                    this.setState({ fav_list: fav_list });
                    console.log("Fav List", fav_list);
                })


        axios.post(url + `/back/search_movies`, search_query)
            .then(res => {
                console.log("Search Initialized");
                console.log(search_query)
                // console.log(res.data.movies_list);
                const movies_list = res.data;
                this.setState({ movies_list: movies_list });
            },
                err => {
                    console.log("Movies API Call ERROR");
                    console.log(search_query)

                    this.setState({
                        movies_list: [{
                            "category": "Action",
                            "cinema_name": "Attikon",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 4,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "Harry Potter 1"
                        },
                        {
                            "category": "Action",
                            "cinema_name": "Attikon",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 5,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/fECBtHlr0RB3foNHDiCBXeg9Bv9.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "Harry Potter 2"
                        },
                        {
                            "category": "Crime",
                            "cinema_name": "Attikon",
                            "end_date": "Sun, 20 Nov 2016 00:00:00 GMT",
                            "movie_id": 35,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg",
                            "start_date": "Sun, 23 Oct 2016 00:00:00 GMT",
                            "title": "Rubber"
                        },
                        {
                            "category": "Crime",
                            "cinema_name": "Ellinis",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 1,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "The Godfather"
                        },
                        {
                            "category": "Crime",
                            "cinema_name": "Ellinis",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 2,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "The Godfather 2"
                        },
                        {
                            "category": "Crime",
                            "cinema_name": "Ellinis",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 3,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "The Godfather 3"
                        }, {
                            "category": "Action",
                            "cinema_name": "Attikon",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 4,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "Harry Potter 1"
                        },
                        {
                            "category": "Action",
                            "cinema_name": "Attikon",
                            "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                            "movie_id": 5,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/fECBtHlr0RB3foNHDiCBXeg9Bv9.jpg",
                            "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                            "title": "Harry Potter 2"
                        },
                        {
                            "category": "Crime",
                            "cinema_name": "Attikon",
                            "end_date": "Sun, 20 Nov 2016 00:00:00 GMT",
                            "movie_id": 35,
                            "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg",
                            "start_date": "Sun, 23 Oct 2016 00:00:00 GMT",
                            "title": "Rubber"
                        }]
                    });

                });

    }

    componentDidMount() {
        this.searchMovies();
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
            <div className={styles.mycont}>
                <div>
                    <div class={styles.search_form} inline>
                        <input class={styles.text_area} onChange={this.handleInputChange} type="text" placeholder="Search" />
                        <input type="date" value={this.state.date} onChange={this.handleDateChange}></input>
                        <div>
                            {this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} class={styles.checkbox}><i class="far fa-check-square"></i> Only Favourites</button>}
                            {!this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} class={styles.checkbox}><i class="far fa-square"></i> Only Favourites</button>}
                        </div>
                    </div>
                </div>
                <div>
                    {
                        this.state.movies_list.map((movie) => (
                            <Movie className={styles.movie}
                                movies={movie}
                                favs={this.state.fav_list}
                                onFavUpdate={() => this.setState({ update: !this.state.update })}
                                favsOnly={this.state.favs_only}
                            />
                        ))
                    }
                </div>
                {
                    this.state.movies_list.length == 0 &&
                    <h3 className={styles.movie}> Sorry, no movies found</h3>
                }
            </div >
        );
    }
}

export default Movies;