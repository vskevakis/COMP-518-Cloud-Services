import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";
// import DatePicker from "../components/Datepicker";
import moment from "moment";
import { Animate } from 'react-animate-mount'


import { checkCookie, checkUser, setCookie } from "../components/Cookies";
import EditMovieModal from "../components/EditMovieModal";
import DeleteMovieModal from "../components/DeleteMovieModal";
import AddMovieModal from "../components/AddMovieModal";



const url = process.env.REACT_APP_SERVICE_URL;

class CinemaOwner extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            cinema: checkCookie(),
            date: moment().format('YYYY-MM-DD'),
            modalShow: false,
            modal2Show: false,
            modal3Show: false,
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
        axios.post(url + `/back/search_cinema_movies`, search_query)
            .then(res => {
                console.log("Search Initialized");
                // console.log(res.data.movies_list);
                const movies_list = res.data;
                this.setState({ movies_list: movies_list });
            },
                err => {
                    console.log("Movies API Call ERROR");
                });
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
        if (prevState.modalShow !== this.state.modalShow) {
            this.searchMovies();
        }
        if (prevState.modal2Show !== this.state.modal2Show) {
            this.searchMovies();
        }
        if (prevState.modal3Show !== this.state.modal3Show) {
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
                <div className={styles.mycont}>
                    <div>
                        <form class={styles.owner_search_form} inline>
                            <input class={styles.text_area} onChange={this.handleInputChange} type="text" placeholder="Search" />
                            <input type="date" onChange={this.handleDateChange} value={this.state.date}></input>
                        </form>
                    </div>
                    <div>
                        <table class={styles.styled_table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th colspan="2"><button class={styles.add_button} onClick={e => this.setState({ modal2Show: true })} class="btn"><i class="fa fa-plus-circle"></i> Add Movie</button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.movies_list.map((movie) => (
                                        <tr>
                                            <td>{movie.title}</td>
                                            <td>{movie.category}</td>
                                            <td>{this.formatter.format(Date.parse(movie.start_date))}</td>
                                            <td>{this.formatter.format(Date.parse(movie.end_date))}</td>
                                            <td><button style={{ 'color': 'lightblue' }} onClick={e => this.setState({ modalShow: true, edit_movie: movie })} class="btn"><i class="fa fa-edit"></i> Edit</button></td>
                                            <td><button style={{ 'color': 'tomato' }} onClick={e => this.setState({ modal3Show: true, edit_movie: movie })} class="btn"><i class="fa fa-trash"></i> Delete</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            this.state.movies_list.length == 0 &&
                            <h3 className={styles.movie}> No movies found</h3>
                        }
                    </div>
                    <EditMovieModal
                        show={this.state.modalShow}
                        onHide={() => this.setState({ modalShow: false })}
                        movie={this.state.edit_movie}
                    />
                    <AddMovieModal
                        show={this.state.modal2Show}
                        onHide={() => this.setState({ modal2Show: false })}
                    />
                    <DeleteMovieModal
                        show={this.state.modal3Show}
                        onHide={() => this.setState({ modal3Show: false })}
                        movie={this.state.edit_movie}
                    />
                </div >
            </Animate>
        );
    }
}

export default CinemaOwner;