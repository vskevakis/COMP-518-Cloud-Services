import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import { useBootstrapPrefix } from 'react-bootstrap/esm/ThemeProvider';
import styles from "../styles/movies.module.css";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;


export default function EditMovieModal(props) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");

    // handleChange() {
    //     // check it out: we get the event.target.name (which will be either "username" or "password")
    //     // and use it to target the key on our `state` object with the same name, using bracket syntax
    //     this.setState({ [target.name]: target.value });
    // }
    const updateMovie = async (title, category, start_date, end_date) => {
        const movie_data = {
            title: title.value,
            category: category.value,
            start_date: start_date.value,
            end_date: end_date.value
        };

        await axios.post(url + "/back/edit_movie", movie_data).then(
            (response) => {
                console.log("Movie Updated")
            },
            (error) => {
                alert("Movie Update Unsuccesful. Please check your movie_data.");
            }
        );
        props.onHide();
    };

    // const handlePasswordChange: function(e) {
    //     title = useState(target.value)
    //  },

    console.log("Editing Movie:");
    console.log(props.movie);
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
                            <td><input placeholder={props.movie.title} ref={title => (setTitle(title))} type="text"></input></td>
                            <td><input style={{ width: "100%" }} placeholder={props.movie.category} type="text" ref={category => (setCategory(category))} ></input></td>
                            <td><input placeholder={props.movie.start_date} type="date" ref={start_date => (setStartDate(start_date))}></input></td>
                            <td><input placeholder={props.movie.end_date} type="date" ref={end_date => (setEndDate(end_date))}></input></td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => updateMovie(title, category, start_date, end_date)}>Save</Button>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >

    );

}