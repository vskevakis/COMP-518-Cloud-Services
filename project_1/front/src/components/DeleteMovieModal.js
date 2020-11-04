import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import styles from "../styles/movies.module.css";
import axios from "axios";
import { checkCookie, checkUser } from './Cookies';

const url = process.env.REACT_APP_SERVICE_URL;

export default function DeleteMovieModal(props) {

    const deleteMovie = async () => {
        const movie_data = {
            title: props.movie.title,
            movie_id: props.movie.movie_id,
            user_role: checkUser(),
            cinema_name: checkCookie()
        };

        await axios.post(url + "/back/delete_movie", movie_data).then(
            (response) => {
                console.log("Movie Deleted")
            },
            (error) => {
                alert("Movie Delete Unsuccesful. Please check your movie_data.");
            }
        );
        props.onHide();
    };

    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                deleteMovie()
            }
        }}>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered

            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete Movie "{props.movie.title}"
                </Modal.Title>
                </Modal.Header>
                <Modal.Body  >
                    <h5> Are you sure you want to delete movie {props.movie.title} ?</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => deleteMovie()}>Delete</Button>
                    <Button variant="black" onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal >
        </div>
    );

}