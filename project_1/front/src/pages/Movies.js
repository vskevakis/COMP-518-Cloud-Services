import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";


import { checkCookie, checkUser, setCookie } from "../components/Cookies";
import { Movie } from "../components/Movie";
import { SearchMovie } from "../components/SearchMovie";


const url = process.env.REACT_APP_SERVICE_URL;


class Movies extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            // username: checkCookie(),
            // role: checkUser(),
            // isAuthenticated: checkCookie(),
            movies_list: []
        };
        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    getMovies = () => {
        axios.get(url + `/back/get_movies`)
            .then(res => {
                const movies_list = res.data;
                this.setState({ movies_list: movies_list });
                console.log("Movies fetched");
                console.log(res.data);
            },
                err => {
                    console.log("Movies API Call ERROR");
                    // this.setState({
                    //     movies_list: [{
                    //         "category": "Horror",
                    //         "cinema_name": "Attikon",
                    //         "end_date": "Fri, 25 Sep 2015 00:00:00 GMT",
                    //         "movie_id": 34,
                    //         "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/7Eb1JWK0Cb0rbfsYjwfc9g0PbQH.jpg",
                    //         "start_date": "Sun, 20 Sep 2015 00:00:00 GMT",
                    //         "title": "Scary Movie 2"
                    //     },
                    //     {
                    //         "category": "Horror",
                    //         "cinema_name": "Attikon",
                    //         "end_date": "Fri, 25 Sep 2015 00:00:00 GMT",
                    //         "movie_id": 34,
                    //         "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/7Eb1JWK0Cb0rbfsYjwfc9g0PbQH.jpg",
                    //         "start_date": "Sun, 20 Sep 2015 00:00:00 GMT",
                    //         "title": "Scary Movie 2",
                    //     }]
                    // });
                });
    }

    searchMovies = () => {
        const search_query = {
            search: this.state.query
        };
        axios.post(url + `/back/search_movies`, search_query)
            .then(res => {
                console.log("Search Initialized");
                // console.log(res.data.movies_list);
                const movies_list = res.data;
                this.setState({ movies_list: movies_list });
            },
                err => {
                    console.log("Movies API Call ERROR");
                    // this.setState({
                    // movies_list: [{
                    //     "category": "Action",
                    //     "cinema_name": "Attikon",
                    //     "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                    //     "movie_id": 4,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                    //     "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                    //     "title": "Harry Potter 1"
                    // },
                    // {
                    //     "category": "Action",
                    //     "cinema_name": "Attikon",
                    //     "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                    //     "movie_id": 5,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/fECBtHlr0RB3foNHDiCBXeg9Bv9.jpg",
                    //     "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                    //     "title": "Harry Potter 2"
                    // },
                    // {
                    //     "category": "Crime",
                    //     "cinema_name": "Attikon",
                    //     "end_date": "Sun, 20 Nov 2016 00:00:00 GMT",
                    //     "movie_id": 35,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg",
                    //     "start_date": "Sun, 23 Oct 2016 00:00:00 GMT",
                    //     "title": "Rubber"
                    // },
                    // {
                    //     "category": "Crime",
                    //     "cinema_name": "Ellinis",
                    //     "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                    //     "movie_id": 1,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    //     "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                    //     "title": "The Godfather"
                    // },
                    // {
                    //     "category": "Crime",
                    //     "cinema_name": "Ellinis",
                    //     "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                    //     "movie_id": 2,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    //     "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                    //     "title": "The Godfather 2"
                    // },
                    // {
                    //     "category": "Crime",
                    //     "cinema_name": "Ellinis",
                    //     "end_date": "Fri, 20 Nov 2015 00:00:00 GMT",
                    //     "movie_id": 3,
                    //     "poster_path": "https://image.tmdb.org/t/p/w300_and_h450_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    //     "start_date": "Fri, 23 Oct 2015 00:00:00 GMT",
                    //     "title": "The Godfather 3"
                    // }]
                    // });
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


    render() {
        return (
            <div>
                <div>
                    <Form className={styles.search_form} inline>
                        <FormControl onChange={this.handleInputChange} type="text" placeholder="Search" className="mr-sm-2" />
                        {/* <Button variant="outline-success">Search</Button> */}
                    </Form>
                </div>
                <div className="{styles.mycont}" >
                    {
                        this.state.movies_list.map((movie) => (
                            <Movie className="{styles.movie}"
                                movies={movie}
                            />
                        ))
                    }
                </div>
                {
                    this.state.movies_list.length == 0 &&
                    <h3 className="{styles.mycont}"> Sorry, no movies found</h3>
                }
            </div >
        );
    }
}

export default Movies;