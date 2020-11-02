import React, { useState, useEffect } from 'react';
import { Modal, Form, FormControl, Button, Col, Row, Container } from "react-bootstrap";
import styles from "../styles/movies.module.css";
import axios from "axios";
import { checkCookie, checkUser } from './Cookies';

const url = process.env.REACT_APP_SERVICE_URL;

export default function AcceptUserModal(props) {

    const acceptUser = async () => {
        const user_data = {
            user_id: props.user.user_id,
            user_role: checkUser(),
        };

        await axios.post(url + "/auth/accept_user", user_data).then(
            (response) => {
                console.log("User Accepted")
            },
            (error) => {
                alert("User Accept Unsuccesful. Please check your user_data.");
            }
        );
        props.onHide();
    };

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
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Accept User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <h4> Are you sure you want to acccept user "{props.user.username}"" ?</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => acceptUser()}>Accept</Button>
                <Button onClick={() => deleteUser()}>Decline</Button>
            </Modal.Footer>
        </Modal >

    );

}