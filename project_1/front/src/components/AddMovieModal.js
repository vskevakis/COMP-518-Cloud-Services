import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import styles from "../styles/movies.module.css";
import axios from "axios";
import { checkCookie, checkUser } from './Cookies';

const url = process.env.REACT_APP_SERVICE_URL;


export default function AddMovieModal(props) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");

    const addMovie = async (title, category, start_date, end_date) => {
        const movie_data = {
            cinema_name: checkCookie(),
            user_role: checkUser(),
            title: title.value,
            category: category.value,
            start_date: start_date.value,
            end_date: end_date.value
        };

        await axios.post(url + "/back/add_movie", movie_data).then(
            (response) => {
                console.log("Movie Updated")
            },
            (error) => {
                alert("Movie Update Unsuccesful. Please check your movie_data.");
            }
        );
        props.onHide();
    };


    console.log("Add Movie");
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Movie
                </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <table >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td><input placeholder="Title" ref={title => (setTitle(title))} type="text" required></input></td>
                            <td><input style={{ width: "100%" }} placeholder="Category" type="text" ref={category => (setCategory(category))} required></input></td>
                            <td><input placeholder="Start Date" type="date" ref={start_date => (setStartDate(start_date))} required></input></td>
                            <td><input placeholder="End Date" type="date" ref={end_date => (setEndDate(end_date))} required></input ></td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => addMovie(title, category, start_date, end_date)}>Add</Button>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >

    );

}