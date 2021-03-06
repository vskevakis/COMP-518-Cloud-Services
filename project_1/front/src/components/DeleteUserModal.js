import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import styles from "../styles/movies.module.css";
import axios from "axios";
import { checkCookie, checkUser } from './Cookies';

const url = process.env.REACT_APP_SERVICE_URL;

export default function DeleteUserModal(props) {

    const deleteUser = async () => {
        const user_data = {
            user_id: props.user.user_id,
            user_role: checkUser(),
        };

        await axios.post(url + "/auth/delete_user", user_data).then(
            (response) => {
                console.log("User Deleted")
            },
            (error) => {
                alert("User Delete Unsuccesful. Please check your user_data.");
            }
        );
        props.onHide();
    };

    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                deleteUser()
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
                        Delete User
                </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <h4> Are you sure you want to delete user {props.user.username} ?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => deleteUser()}>Delete</Button>
                    <Button variant="black" onClick={props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal >
        </div>
    );

}