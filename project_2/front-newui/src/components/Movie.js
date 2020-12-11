import React, { useState, useEffect } from 'react';
import { checkUserID, checkToken } from "./Cookies";
import axios from "axios";
import { MoviePanel } from '../components/MoviePanel';


const url_prefix = process.env.REACT_APP_SERVICE_URL;

export function Movie(props) {
    const [fav, setFav] = useState(true);
    const [favList, setFavList] = useState(props.favs);
    const [latestFav, setlatestFav] = useState(0);
    const [panelShow, setpanelShow] = useState(false);
    const formatter = new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        month: "short",
        day: "2-digit"
    });


    const modFavourite = async (props) => {
        const favourite_data = {
            movie_id: props.movie_id,
            user_id: checkUserID(),
            title: props.title
        };
        await axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/data-storage/favourites",
            data: favourite_data,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("POST /favourites - SUCCESS")
                setFavList(response.data)
            },
            (error) => {
                console.log("POST /favourites - ERROR");
            }
        );
    };

    if (props.favsOnly && !favList.includes(props.movies.movie_id)) {
        return null;
    }
    else {
        return (
            <li x-for="item in items">
                <a class="bg-light max-w-xs hover:border-transparent hover:shadow-lg group block rounded-lg border border-gray-200 dark:border-gray-900 dark:bg-gray-900">
                    <dl class="grid h-80 sm:block lg:grid xl:grid auto-cols-auto rounded-t-lg  grid-rows-4 items-center bg-center bg-no-repeat" style={{ backgroundImage: "url(" + props.movies.poster_path + ")" }}>
                        <div class=" col-start-1 row-start-1 row-end-1">
                            <dt class="text-gray-600 sr-only">Category</dt>
                            <a class="flex justify-left">
                                <a class="bg-gray-200 border-gray-600 dark:bg-gray-900 dark:text-gray-400 py-2 px-5">{props.movies.category}</a>
                            </a>
                        </div>
                        {/* <a href="#" onClick={() => setpanelShow(true)} class="col-start-1 text-center row-start-3 row-end-5"> */}
                        <dt class="sr-only">Title</dt>
                        <dd class=" dark:text-gray-400 invisible group-hover:visible leading-loose font-semibold py-5 text-xl text-light-blue-200 col-start-1 text-center row-start-2 row-end-5">
                            {!favList.includes(props.movies.movie_id) && <button onClick={() => modFavourite(props.movies)} ><svg width="150" height="150" xmlns="http://www.w3.org/2000/svg" fill="white" fill-opacity="0.5" viewBox="0 0 24 24" stroke="white">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg></button>}
                            {favList.includes(props.movies.movie_id) && <button onClick={() => modFavourite(props.movies)} ><svg width="150" height="150" xmlns="http://www.w3.org/2000/svg" fill="tomato" fill-opacity="0.6" viewBox="0 0 24 24" stroke="tomato">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg></button>}
                        </dd>
                        {/* </a> */}
                    </dl>
                    <dl class="grid dark:text-gray-400 h-20 sm:block lg:grid xl:grid auto-cols-auto grid-rows-4 items-center ">
                        <div class="col-start-1 text-center row-start-1 row-end-3">
                            <dt class="sr-only">Title</dt>
                            <dd class="inline-flex group-hover:visible text-light-blue-200 text-2xl font-medium sm:mb-4 lg:mb-0 xl:mb-4">
                                {props.movies.title}
                            </dd>
                        </div>
                        <div class="col-start-1 text-center row-start-3 row-end-4">
                            <dt class="sr-only">Cinema Name</dt>
                            <dd class="inline-flex group-hover:visible text-light-blue-200 text-lg font-medium sm:mb-4 lg:mb-0 xl:mb-4">
                                {props.movies.cinema_name}
                            </dd>
                        </div>
                        <div class="col-start-1 text-center row-start-4 row-end-5">
                            <dt class="sr-only">Date</dt>
                            <dd class="inline-flex group-hover:visible text-light-blue-200 text-md font-normal sm:mb-4 lg:mb-0 xl:mb-4">
                                {formatter.format(Date.parse(props.movies.start_date))} to {formatter.format(Date.parse(props.movies.end_date))}
                            </dd>
                        </div>
                    </dl>
                </a>
                {
                    // panelShow && <MoviePanel
                    //     onHide={() => setpanelShow(false)}
                    //     movie={props.movies}
                    // />
                }
            </li >
        );
    }
}