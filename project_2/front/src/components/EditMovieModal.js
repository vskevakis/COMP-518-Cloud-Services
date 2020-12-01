import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import styles from "../styles/movies.module.css";
import axios from "axios";
import moment from "moment";


const url_prefix = process.env.REACT_APP_SERVICE_URL;


export default function EditMovieModal(props) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");

    const updateMovie = async (title, category, start_date, end_date) => {
        const movie_data = {
            movie_id: props.movie.movie_id,
            title: title.value,
            category: category.value,
            start_date: start_date.value,
            end_date: end_date.value
        };

        axios({
            method: 'patch', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies",
            data: movie_data
        }).then(
            (response) => {
                console.log("Movie Updated");
            },
            (error) => {
                alert("Movie Update Unsuccesful. Please check your movie_data.");
            }
        );
        props.onHide();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Movie "{props.movie.title}"
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
                            <td><input onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    updateMovie(title, category, start_date, end_date)
                                }
                            }} className="edit-form" placeholder={props.movie.title} ref={title => (setTitle(title))} type="text"></input></td>
                            <td><input onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    updateMovie(title, category, start_date, end_date)
                                }
                            }} className="edit-form" style={{ width: "100%" }} placeholder={props.movie.category} type="text" ref={category => (setCategory(category))} ></input></td>
                            <td><input onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    updateMovie(title, category, start_date, end_date)
                                }
                            }} class={styles.date} value={moment(props.movie.start_date).format('YYYY-MM-DD')} type="date" ref={start_date => (setStartDate(start_date))}></input></td>
                            <td><input onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    updateMovie(title, category, start_date, end_date)
                                }
                            }} class={styles.date} value={moment(props.movie.end_date).format('YYYY-MM-DD')} type="date" ref={end_date => (setEndDate(end_date))}></input></td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => updateMovie(title, category, start_date, end_date)}>Save</Button>
                <Button variant="black" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}