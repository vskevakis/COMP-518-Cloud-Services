import styles from "../styles/movies.module.css";
import * as React from "react";
import { Form, Button, FormControl } from "react-bootstrap";

export function SearchMovie() {
    return (
        <Form className={styles.search_form} inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
        </Form>
    );
}