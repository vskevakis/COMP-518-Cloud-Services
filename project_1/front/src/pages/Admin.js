import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";
// import DatePicker from "../components/Datepicker";
import moment from "moment";
import { Animate } from 'react-animate-mount'


import { checkCookie, checkUser, setCookie } from "../components/Cookies";
import { Movie } from "../components/Movie";
import { SearchMovie } from "../components/SearchMovie";
import AcceptUserModal from "../components/AcceptUserModal";
import DeleteUserModal from "../components/DeleteUserModal";



const url = process.env.REACT_APP_SERVICE_URL;

class Admin extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            modalShow: false,
            modal2Show: false,
            edit_user: "",
            users_list: [],
            show: false
        };
        // this.setState = this.setState()
        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    searchUsers = () => {
        const search_query = {
            search: this.state.query
        };
        axios.post(url + `/auth/get_users`, search_query)
            .then(res => {
                console.log("Search Initialized");
                // console.log(res.data.movies_list);
                const users_list = res.data;
                this.setState({ users_list: users_list });
            },
                err => {
                    console.log("Users API Call ERROR");
                    this.setState({
                        users_list: [{
                            "user_id": 125,
                            "username": "skevobillos",
                            "name": "Vasilis",
                            "surname": "Skevakis",
                            "email": "vasilis@skevakis.com",
                            "role": "Admin",
                            "is_confirmed": false
                        },
                        {
                            "user_id": 165,
                            "username": "Ellinis",
                            "name": "Takis",
                            "surname": "Flevakis",
                            "email": "takis@flevakis.com",
                            "role": "CinemaOwner",
                            "is_confirmed": false
                        },
                        {
                            "user_id": 122,
                            "username": "makis",
                            "name": "Kanakis",
                            "surname": "Akis",
                            "email": "kanakis@akis.com",
                            "role": "User",
                            "is_confirmed": true
                        }]
                    });
                });
    }

    handleInputChange = (event) => {
        this.setState({
            query: event.target.value
        }, () => {
            this.searchUsers();
        })
    }

    componentDidMount() {
        this.searchUsers();
        this.setState({ show: true });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.modalShow !== this.state.modalShow) {
            this.searchUsers();
        }
        if (prevState.modal2Show !== this.state.modal2Show) {
            this.searchUsers();
        }
    }

    render() {
        return (
            <Animate type="fade" duration="1000" show={this.state.show}>
                <div>
                    <form class={styles.owner_search_form} inline>
                        <input class={styles.text_area} onChange={this.handleInputChange} type="text" placeholder="Search" />
                    </form>
                </div>
                <div className={styles.mycont}>
                    <div>
                        <table class={styles.styled_table}>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>User ID</th>
                                    <th>Surname</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th colSpan="2"></th>
                                    {/* <th colspan="2"><button class={styles.add_button} onClick={e => this.setState({ modal2Show: true })} class="btn"><i class="fa fa-plus-circle"></i> Add Movie</button></th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users_list.map((user) => (
                                        <tr>
                                            <td>{user.role}</td>
                                            <td>{user.user_id}</td>
                                            <td>{user.surname}</td>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.is_confirmed == false && <button style={{ 'color': 'lightgreen' }} onClick={e => this.setState({ modalShow: true, edit_user: user })} class="btn"><i class="fas fa-user-check"></i> Accept User</button>}
                                                {user.is_confirmed == true && <button style={{ 'color': 'dark' }} class="btn" disabled><i class="fas fa-user-check" ></i> Confirmed</button>}</td>
                                            <td><button style={{ 'color': 'tomato' }} onClick={e => this.setState({ modal2Show: true, edit_user: user })} class="btn"><i class="fas fa-trash-alt"></i> Delete</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            this.state.users_list.length == 0 &&
                            <h3 className={styles.movie}> No users found</h3>
                        }
                    </div>
                    <AcceptUserModal
                        show={this.state.modalShow}
                        onHide={() => this.setState({ modalShow: false })}
                        user={this.state.edit_user}
                    />
                    <DeleteUserModal
                        show={this.state.modal2Show}
                        onHide={() => this.setState({ modal2Show: false })}
                        user={this.state.edit_user}
                    />
                </div >
            </Animate>
        );
    }
}

export default Admin;