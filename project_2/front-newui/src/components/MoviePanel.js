import React, { useState, useEffect } from 'react';
import axios from "axios";
import { checkCookie, checkUser } from './Cookies';

const url_prefix = process.env.REACT_APP_SERVICE_URL;

export function MoviePanel(props) {
    const [movieInfo, setmovieInfo] = useState()
    const [fetchData, setfetchData] = useState(true)

    if (fetchData) {
        setfetchData(false);
        axios({
            method: 'get', //you can set what request you want to be
            url: "https://api.themoviedb.org/3/search/movie?api_key=ef959111db7fa4c60077b43c0c0a157e&language=en-US%2C%20el-GR&query=" + props.movie.title + "&page=1&include_adult=false"
        }).then(
            (response) => {
                console.log("Search Initialized");
                // console.log(res.data.movies_list);
                const movies_list = response.data;
                setmovieInfo(response.data.results[0])
            },
            (error) => {
                console.log("Movies API Call ERROR");
            }
        );

    }

    return (
        <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex" aria-labelledby="slide-over-heading">

                    <div class="relative w-screen max-w-md">

                        <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                            <button onClick={props.onHide} class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                <span class="sr-only">Close panel</span>
                                {/* <!-- Heroicon name: x --> */}
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                            <div class="px-4 sm:px-6">
                                <h2 id="slide-over-heading" class="text-lg font-medium text-gray-900">
                                    {props.movie.title}
                                </h2>
                            </div>
                            <div class="mt-6 relative flex-1 px-4 sm:px-6">
                                {/* <!-- Replace with your content --> */}
                                <div class="absolute inset-0 px-4 sm:px-6">
                                    <div style={{ backgroundImage: 'https://image.tmdb.org/t/p/w1000_and_h450_multi_faces/pLVrN9B750ehwTFdQ6n3HRUERLd.jpg' }}>
                                    </div>
                                </div>
                                {/* <!-- /End replace --> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    )
}