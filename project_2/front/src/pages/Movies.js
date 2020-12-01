import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";
import moment from "moment";
import { Animate } from 'react-animate-mount'


import { checkCookie, checkUser, setCookie, checkUserID } from "../components/Cookies";
import { Movie } from "../components/Movie";
import { SearchMovie } from "../components/SearchMovie";
const url_prefix = process.env.REACT_APP_SERVICE_URL;

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
            // items: 10,
        };
    }


    searchMovies = () => {
        const search_query = {
            search: this.state.query,
            date: this.state.date,
        };
        const user_id = {
            user_id: this.state.user_id
        }
        // axios.post(url + `/back/get_favs`, user_id)
        //     .then(res => {
        //         console.log("Favs Initialized");
        //         console.log(user_id)
        //         // console.log(res.data.movies_list);
        //         const fav_list = res.data;
        //         this.setState({ fav_list: fav_list });
        //     },
        //         err => {
        //             const fav_list = [4, 35, 1]
        //             this.setState({ fav_list: fav_list });
        //             console.log("Fav List", fav_list);
        //         })
        axios({
            method: 'get', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies?search=" + this.state.query + "&date=" + this.state.date
        }).then(
            (response) => {
                console.log("Search Initialized");
                console.log(search_query)
                // console.log(res.data.movies_list);
                const movies_list = response.data;
                this.setState({ movies_list: movies_list });
            },
            (error) => {
                console.log("Movies API Call ERROR");
                console.log(search_query);
            }
        );

    }

    componentDidMount() {
        this.searchMovies();
        this.setState({ show: true });

    }

    // loadMore() {
    //     if (this.state.items === this.state.movies_list) {
    //         this.setState({ hasMore: false });
    //     } else {
    //         setTimeout(() => {
    //             this.setState({ items: this.state.items + 10 });
    //         }, 1000);
    //     }
    // }

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
                <div class={styles.search_form} inline>
                    <input class={styles.text_area} onChange={this.handleInputChange} type="text" placeholder="Search" />
                    <input type="date" value={this.state.date} onChange={this.handleDateChange}></input>
                    <div>
                        {this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} class={styles.checkbox}><i class="far fa-check-square"></i> Only Favourites</button>}
                        {!this.state.favs_only && <button onClick={() => this.setState({ favs_only: !this.state.favs_only })} class={styles.checkbox}><i class="far fa-square"></i> Only Favourites</button>}
                    </div>
                </div>
                <div className={styles.mycont}>
                    {
                        // this.state.movies_list.slice(0, this.state.items).map((movie) => (
                        this.state.movies_list.map((movie) => (
                            <Movie className={styles.items}
                                movies={movie}
                                favs={this.state.fav_list}
                                onFavUpdate={() => this.setState({ update: !this.state.update })}
                                favsOnly={this.state.favs_only}
                            />
                        ))
                    }
                </div>
                <div class={styles.search_form}>
                    {/* {
                        this.state.items < this.state.movies_list.length &&
                        <Button class='justify-content-center' variant="dark" onClick={() => this.loadMore()} className={styles.movie}> Load More</Button>
                    } */}
                    {
                        this.state.movies_list.length === 0 &&
                        <h3 className={styles.movie}> No movies found</h3>
                    }
                </div>
            </Animate >
        );
    }
}

export default Movies;