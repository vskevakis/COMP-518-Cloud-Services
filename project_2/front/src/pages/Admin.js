import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/movies.module.css";
// import DatePicker from "../components/Datepicker";
import moment from "moment";
import { Animate } from 'react-animate-mount'


import { checkCookie, checkUser, getCookie, setCookie } from "../components/Cookies";
import { Movie } from "../components/Movie";
import { SearchMovie } from "../components/SearchMovie";
import AcceptUserModal from "../components/AcceptUserModal";
import DeleteUserModal from "../components/DeleteUserModal";



const url_prefix = process.env.REACT_APP_SERVICE_URL;
const app_id = "";

class Admin extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            modalShow: false,
            modal2Show: false,
            edit_user: "",
            users_list: [],
            show: false,
            x_auth_token: ""
        };
        // this.setState = this.setState()
        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    searchUsers = () => {
        const token = { token: getCookie('access_token') };
        const headers = {
            'Content-Type': 'application/json',
        }
        axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/v1/auth/tokens",
            data: token,
            headers: headers
        }).then(
            (response) => {
                console.log(response);
                this.setState({ x_auth_token: response.headers['x-subject-token'] });
                headers = {
                    'X-Auth-token': this.state.x_auth_token,
                    'Content-Type': 'application/json',
                }
                axios({
                    method: 'post', //you can set what request you want to be
                    url: url_prefix + "/applications/" + app_id + "/users",
                    data: null,
                    headers: headers
                }).then(
                    (response) => {
                        console.log(response);
                        setCookie(response.data.access_token, response.data.refresh_token);
                        this.setState({ isAuthenticated: true });
                    },
                    (error) => {
                        setCookie(0, 0);
                        console.log("You failed AGAIN");
                        console.log(error);
                    }
                );
            },
            (error) => {
                alert("Token expired. Please login again.");
                setCookie(0, 0);
                console.log("Token must have expired");
                console.log(error);
            }
        );
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