import styles from "../styles/movies.module.css";
import React, { useState, useEffect } from 'react';
import { checkUserID } from "./Cookies";
import axios from "axios";

const url = process.env.REACT_APP_SERVICE_URL;


export function Movie(props) {
    const [fav, setFav] = useState(false);
    const [favList, setFavList] = useState(props.favs);
    const formatter = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        month: "short",
        day: "2-digit"
    });
    // console.log('Fav: ', props.favs.indexOf(props.movie.movie_id))


    const addFavourite = async (movie_id) => {
        const favourite_data = {
            movie_id: movie_id,
            user_id: checkUserID()
        };

        await axios.post(url + "/back/modify_fav", favourite_data).then(
            (response) => {
                console.log("Favourites Updated")
                // Updating cached fav list to avoid API Calls
                if (response.data) {
                    favList.splice(favList.indexOf(movie_id))
                }
                else {
                    favList.push(movie_id)
                }
            },
            (error) => {
                console.log("Favourites Update Unsuccesful. Please check your movie_data.");
            }
        );
        props.onFavUpdate();
    };

    if (props.favsOnly && (favList.indexOf(props.movies.movie_id)) < 0) {
        return null;
    }
    else {
        return (
            <div className={styles.maincont}>
                <div className={styles.container}>
                    <img className={styles.moviePoster} src={props.movies.poster_path} alt={props.movies.title} />
                    <div class={styles.movieDetails}>
                        <div class={styles.movieEffect}>
                            <ul className={styles.litext}>
                                <li class={styles.category}>{props.movies.category}</li>
                                <li class={styles.favourite}> {favList.indexOf(props.movies.movie_id) < 0 && <button onClick={() => addFavourite(props.movies.movie_id)} style={{ 'font-size': '30px', 'color': 'white' }} class='btn'><i class="fa fa-heart"></i></button>}
                                    {favList.indexOf(props.movies.movie_id) >= 0 && <button onClick={() => addFavourite(props.movies.movie_id)} style={{ 'font-size': '30px', 'color': 'tomato' }} class='btn'><i class="fa fa-heart"></i></button>}
                                </li>
                                <li class={styles.movie_title}>{props.movies.title}</li>
                                <li class={styles.cinema}>Cinema: {props.movies.cinema_name}</li>
                                <li class={styles.date}> {formatter.format(Date.parse(props.movies.start_date))} to {formatter.format(Date.parse(props.movies.end_date))}</li>
                            </ul>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}