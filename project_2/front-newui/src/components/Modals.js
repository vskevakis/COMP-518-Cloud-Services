import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { checkCookie, checkUser, checkToken, checkUserID } from './Cookies';
import moment from "moment";
import SearchBar from "./SearchBar";

const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit"
});

const url_prefix = process.env.REACT_APP_SERVICE_URL;

export function DeleteMovieModal(props) {

    const deleteMovie = async () => {
        axios({
            method: 'delete', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies?movie_id=" + props.movie.movie_id,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
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

            <div class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="bg-white dark:bg-mid-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    {/* <!-- Heroicon name: exclamation --> */}
                                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-headline">
                                        Delete movie
            </h3>
                                    <div class="mt-2">
                                        <p class="text-sm dark:text-gray-400 text-gray-500">
                                            Are you sure you want to delete movie "{props.movie.title}"? All of the movie's data will be permanently removed. This action cannot be undone.
              </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-dark-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={deleteMovie} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Delete
        </button>
                            <button onClick={props.onHide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AddMovieModal(props) {
    const inputTitle = useRef(null);
    const inputCat = useRef(null);
    const inputStart = useRef(null);
    const inputEnd = useRef(null);

    const addMovie = async () => {
        const movie_data = {
            cinema_name: props.cinema,
            title: inputTitle.current.value,
            category: inputCat.current.value,
            start_date: inputStart.current.value ? moment(inputStart.current.value).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            end_date: inputEnd.current.value ? moment(inputEnd.current.value).format('YYYY-MM-DD') : moment().add(1, 'week').format('YYYY-MM-DD')
        };
        axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies",
            data: movie_data,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("POST /movie - SUCCESS");
                props.onHide()
            },
            (error) => {
                alert("Movie Update Unsuccesful. Please check your movie_data.");
            }
        );
    };





    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                addMovie()
            }
        }}>
            <div class="fixed z-10 inset-0 overflow-y-auto" >
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 " >
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="bg-white dark:bg-mid-dark  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <form action="#" method="POST">
                                <div class="px-4 py-5 bg-white dark:bg-mid-dark sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class=" border-b-2 mt-1 border-gray-300 col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 dark:border-gray-800" >Title:</label>
                                            <input ref={inputTitle} type="text" name="title" id="title" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400  border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                            {/* <SearchBar ref={inputTitle} class="block text-sm font-medium text-gray-700 border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" /> */}
                                        </div>

                                        <div class="col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Category:</label>
                                            <input ref={inputCat} type="text" name="movie_category" id="movie_category" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400 border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date:</label>
                                            <input ref={inputStart} type="date" name="start_date" id="start_date" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400" required>End Date:</label>
                                            <input ref={inputEnd} type="date" name="end_date" id="end_date" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400 mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="bg-gray-50 dark:bg-dark-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={addMovie} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Save
                            </button>
                            <button onClick={props.onHide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export function EditMovieModal(props) {
    const inputTitle = useRef(null);
    const inputCat = useRef(null);
    const inputStart = useRef(null);
    const inputEnd = useRef(null);

    const updateMovie = async () => {
        const movie_data = {
            movie_id: props.movie.movie_id,
            cinema_name: props.cinema,
            title: inputTitle.current.value ? inputTitle.current.value : props.movie.title,
            category: inputCat.current.value ? inputCat.current.value : props.movie.category,
            start_date: inputStart.current.value ? moment(inputStart.current.value).format('YYYY-MM-DD') : props.movie.start_date,
            end_date: inputEnd.current.value ? moment(inputEnd.current.value).format('YYYY-MM-DD') : props.movie.end_date
        };

        axios({
            method: 'patch', //you can set what request you want to be
            url: url_prefix + "/data-storage/movies",
            data: movie_data,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("Movie Updated");
                props.onHide()
            },
            (error) => {
                alert("Movie Update Unsuccesful. Please check your movie_data.");
            }
        );
    };


    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                updateMovie(props.movie.movie_id)
            }
        }}>
            <div class="fixed z-10 inset-0 overflow-y-auto" >
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="bg-white dark:bg-mid-dark  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <form action="#" method="POST">
                                <div class="px-4 py-5 bg-white dark:bg-mid-dark  sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class="  col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 dark:border-gray-800">Title:</label>
                                            <input type="text" name="movie_title" ref={inputTitle} placeholder={props.movie.title} id="movie_title" class="border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Category:</label>
                                            <input type="text" name="movie_category" ref={inputCat} placeholder={props.movie.category} id="movie_category" class="border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date:</label>
                                            <input type="date" name="start_date" ref={inputStart} id="start_date" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400" required>End Date:</label>
                                            <input type="date" name="end_date" ref={inputEnd} id="end_date" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="bg-gray-50 dark:bg-dark-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={updateMovie} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Save
                            </button>
                            <button onClick={props.onHide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export function AddCinemaModal(props) {
    const inputName = useRef(null);

    const addCinema = async () => {
        const cinema_data = {
            cinema_name: inputName.current.value,
            user_id: checkUserID()
        };
        axios({
            method: 'post', //you can set what request you want to be
            url: url_prefix + "/data-storage/cinemas",
            data: cinema_data,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("POST /cinemas - SUCCESS");
                props.onHide()
            },
            (error) => {
                alert("Cinema Add Unsuccesful. Please check your cinema_data.");
            }
        );
    };

    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                addCinema()
            }
        }}>
            <div class="fixed z-10 inset-0 overflow-y-auto" >
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 " >
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="bg-white dark:bg-mid-dark  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <form action="#" method="POST">
                                <div class="px-4 py-5 bg-white dark:bg-mid-dark sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class=" border-b-2 mt-1 border-gray-300 col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 dark:border-gray-800" >Cinema Name:</label>
                                            <input ref={inputName} type="text" name="cinema_name" id="cinema_name" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400  border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Address:</label>
                                            <input type="text" name="cinema_address" id="cinema_address" placeholder="Future Feature" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400 border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-6 ">
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-400">Cinema Website</label>
                                            <input type="text" name="cinema_website" id="cinema_website" placeholder="Future Feature" class="dark:bg-mid-dark dark:border-gray-800 dark:text-gray-400 border-b-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
                                        </div>


                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="bg-gray-50 dark:bg-dark-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={addCinema} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Add
                            </button>
                            <button onClick={props.onHide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export function DeleteCinemaModal(props) {

    const deleteCinema = async () => {
        axios({
            method: 'delete', //you can set what request you want to be
            url: url_prefix + "/data-storage/cinemas?cinema_name=" + props.cinema,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': checkToken()
            }
        }).then(
            (response) => {
                console.log("Cinema Deleted")
            },
            (error) => {
                alert("Cinema Delete Unsuccesful. Please check your cinema_data.");
            }
        );
        props.onHide();
    };

    return (
        <div onKeyPress={(event) => {
            if (event.key === 'Enter') {
                deleteCinema()
            }
        }}>

            <div class="fixed z-10 inset-0 overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div class="bg-white dark:bg-mid-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    {/* <!-- Heroicon name: exclamation --> */}
                                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200" id="modal-headline">
                                        Delete cinema
            </h3>
                                    <div class="mt-2">
                                        <p class="text-sm dark:text-gray-400 text-gray-500">
                                            Are you sure you want to delete cinema "{props.cinema}"? All of the movie's in this cinema will be permanently removed. This action cannot be undone.
              </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-dark-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={deleteCinema} type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Delete
        </button>
                            <button onClick={props.onHide} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Cancel
        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
