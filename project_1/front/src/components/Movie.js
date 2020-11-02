import styles from "../styles/movies.module.css";
import * as React from "react";

export function Movie(props) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        month: "short",
        day: "2-digit"
    });
    console.log(props.movies);
    return (
        <div className={styles.maincont}>
            <div className={styles.container}>
                <img className={styles.moviePoster} src={props.movies.poster_path} alt={props.movies.title} />
                <div className={styles.movieDetails}>
                    <ul className={styles.litext}>
                        <li className={styles.movie_title}>{props.movies.title}</li>
                        <li className={styles.category}>Category: {props.movies.category}</li>
                        <li className={styles.cinema}>Cinema: {props.movies.cinema_name}</li>
                        <li className={styles.date}> {formatter.format(Date.parse(props.movies.start_date))} to {formatter.format(Date.parse(props.movies.end_date))}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}