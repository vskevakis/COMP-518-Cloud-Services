import os
import datetime
import time
import json
import enum
import pymongo
import requests
from urllib.parse import urljoin
from flask import Flask, jsonify, Response, request
from pymongo import MongoClient, TEXT
from bson.objectid import ObjectId
from gevent import monkey
from flask_socketio import SocketIO, emit

# Initialize Application
monkey.patch_all()
app = Flask(__name__)
socketio = SocketIO(app)  # async_mode=async_mode,

#---------Database Configuration-----------#
client = MongoClient(os.environ['MONGO_HOST'], int(os.environ['MONGO_PORT']))

# Create Database
db = client['MONGO_DB_NAME']

# Database Movie Model
collection = db['movies-collection']
favs_collection = db['favourites-collection']
db.movies.create_index(
    [("start_date", 1)])
db.movies.create_index(
    [("end_date", 1)])

#------------Movies API-----------#


def get_poster(title):
    try:
        response = requests.get(
            "https://api.themoviedb.org/3/search/movie?api_key="+os.environ['MOVIE_DB_API_KEY']+"&query="+title+"&page=1&include_adult=false")
        tmdb = response.json()
        tmdb_path = json.dumps(tmdb["results"][0]["poster_path"])
        tmdb_poster = str(
            "https://image.tmdb.org/t/p/w300_and_h450_bestv2") + str(tmdb_path.replace("\"", ""))
        return tmdb_poster
    except:
        # Easter Egg in case request fail or doesn't return items
        tmdb_poster = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg"
        return tmdb_poster

# CreateMovie API
@app.route("/movies", methods=["POST"])
def add_movie():
    title = request.json['title']
    start_date = request.json['start_date']
    end_date = request.json['end_date']
    category = request.json['category']
    cinema_name = request.json['cinema_name']

    # if user_role is not ("cinemaowner" or "admin"):  # Need to remove Admin From Here
    #     error = 'You do not have authorization to add movie'
    #     return Response(error, status=400)
    movies = db.movies
    if (movies.find_one({"title": title, "cinema_name": cinema_name})):
        return Response('This cinema already has this movie', status=401)
    movie = {
        "title": title,
        "cinema_name": cinema_name,
        "category": category,
        "start_date": datetime.datetime.strptime(start_date, '%Y-%m-%d'),
        "end_date": datetime.datetime.strptime(end_date, '%Y-%m-%d'),
        "poster_path": get_poster(title)
    }
    movie_id = movies.insert_one(movie).inserted_id

    # Add movie to Orion
    url = "http://orion:1026/v2/entities"
    payload = {
        "id": str(movie_id),
        "type": "movie",
        "title": {
            "value": title,
            "type": "String"
        },
        "start_date": {
            "value": start_date,
            "type": "String"
        },
        "end_date": {
            "value": end_date,
            "type": "String"
        },
        "category": {
            "value": category,
            "type": "String"
        }
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request(
        "POST", url, headers=headers, data=json.dumps(payload))
    return Response('Movie ID is: ' + str(movie_id) + "and Orion response " + str(response), status=200)


@app.route("/movies", methods=["DELETE"])
def delete_movie():
    movie_id = request.args['movie_id']
    movies = db.movies
    if(movies.delete_one({"_id": ObjectId(movie_id)})):
        # Delete entity in ORION
        url = "http://orion:1026/v2/entities/"+movie_id
        response = requests.request(
            "DELETE", url, headers={}, data={})
        return Response('Deleted Movie ' + str(movie_id) + 'and Orion response' + str(response), status=200)
    else:
        return Response('Movie not found', status=404)


@app.route("/movies", methods=["PATCH"])
def edit_movie():
    movie_id = request.json['movie_id']
    movies = db.movies
    url = "http://orion:1026/v2/entities/"+movie_id+"/attrs"
    headers = {'Content-Type': 'application/json'}
    if (movies.find_one({"_id": ObjectId(movie_id)})) is None:
        error = 'A movie with that id does not exist'
        return Response(error, status=404)
    else:
        try:
            title = request.json['title']
            if title:
                movies.update_one(
                    {"_id": ObjectId(movie_id)},
                    {"$set": {"title": title, "poster_path": poster_path}}
                )
                payload = {
                    "title": {
                        "value": title,
                        "type": "String"
                    }
                }
                requests.request("PATCH", url, headers=headers,
                                 data=json.dumps(payload))
        except:
            title = None
        try:
            start_date = request.json['start_date']
            if start_date:
                movies.update_one(
                    {"_id": ObjectId(movie_id)},
                    {"$set": {"start_date": start_date}}
                )
                payload = {
                    "start_date": {
                        "value": start_date,
                        "type": "String"
                    }
                }
                requests.request("PATCH", url, headers=headers,
                                 data=json.dumps(payload))
        except:
            start_date = None
        try:
            end_date = request.json['end_date']
            if end_date:
                movies.update_one(
                    {"_id": ObjectId(movie_id)},
                    {"$set": {"end_date": end_date}}
                )
                payload = {
                    "end_date": {
                        "value": end_date,
                        "type": "String"
                    }
                }
                requests.request("PATCH", url, headers=headers,
                                 data=json.dumps(payload))
        except:
            end_date = None
        try:
            category = request.json['category']
            if category:
                movies.update_one(
                    {"_id": ObjectId(movie_id)},
                    {"$set": {"category": category}}
                )
                payload = {
                    "category": {
                        "value": category,
                        "type": "String"
                    }
                }
                requests.request("PATCH", url, headers=headers,
                                 data=json.dumps(payload))
        except:
            category = None
        return Response('Movie ' + str(movie_id) + ' edited with success', status=200)


@app.route("/movies", methods=["GET"])
def get_movies():
    movies = db.movies
    search_query = request.args['search']
    date_query = request.args['date']
    movies_list = []
    if (search_query and date_query):
        for movie in movies.find({"$or": [
            {"title": {"$regex": search_query}},
            {"category": {"$regex": search_query}},
            {"cinema_name": {"$regex": search_query}},
            {"$and": [
                {"start_date": {"$lte": datetime.datetime.strptime(
                    date_query, '%Y-%m-%d')}},
                {"end_date": {"$gte": datetime.datetime.strptime(
                    date_query, '%Y-%m-%d')}}
            ]}
        ]}):
            movies_list.append({'movie_id': str(movie['_id']),
                                'title': movie['title'],
                                'category': movie['category'],
                                'start_date': movie['start_date'],
                                'end_date': movie['end_date'],
                                'cinema_name': movie['cinema_name'],
                                'poster_path': movie['poster_path'],
                                })
    elif (search_query):
        for movie in movies.find({"$or": [
            {"title": {"$regex": search_query}},
            {"category": {"$regex": search_query}},
            {"cinema_name": {"$regex": search_query}},
        ]}):
            movies_list.append({'movie_id': str(movie['_id']),
                                'title': movie['title'],
                                'category': movie['category'],
                                'start_date': movie['start_date'],
                                'end_date': movie['end_date'],
                                'cinema_name': movie['cinema_name'],
                                'poster_path': movie['poster_path'],
                                })
    elif (date_query):
        for movie in movies.find({"$and": [
            {"start_date": {"$lte": datetime.datetime.strptime(
                date_query, '%Y-%m-%d')}},
            {"end_date": {"$gte": datetime.datetime.strptime(
                date_query, '%Y-%m-%d')}}
        ]}):
            movies_list.append({'movie_id': str(movie['_id']),
                                'title': movie['title'],
                                'category': movie['category'],
                                'start_date': movie['start_date'],
                                'end_date': movie['end_date'],
                                'cinema_name': movie['cinema_name'],
                                'poster_path': movie['poster_path'],
                                })
    else:
        movies_list = []
        for movie in movies.find():
            movies_list.append({'movie_id': str(movie['_id']),
                                'title': movie['title'],
                                'category': movie['category'],
                                'start_date': movie['start_date'],
                                'end_date': movie['end_date'],
                                'cinema_name': movie['cinema_name'],
                                'poster_path': movie['poster_path'],
                                })
    if (movies_list):
        return jsonify(movies_list)
    else:
        return Response("No movies found", status=300)


@app.route("/favourites", methods=["POST"])
def add_fav():
    user_id = request.json['user_id']
    movie_id = request.json['movie_id']
    favourite = {
        "user_id": user_id,
        "movie_id": movie_id
    }
    if (db.favourites.find_one({"$and": [{'user_id': user_id}, {'movie_id': movie_id}]}) is not None):
        return Response("Movie is already favourite for that user", status=400)
    sub_data = {
        "subject": {
            "entities": [
                {
                    "id": movie_id,
                    "type": "movie"
                }
            ],
            "condition": {
                "attrs": [
                    "category",
                    "end_date",
                    "start_date",
                    "title"
                ]
            }
        },
        "notification": {
            "http": {
                "url": "http://data-storage:5001/notification"
            },
            "attrs": [
                "category",
                "end_date",
                "start_date",
                "title",
            ]
        },
        "expires": "2030-01-01T14:00:00.00Z",
        "throttling": 5
    }
    headers = {
        'Content-Type': 'application/json'
    }
    url = "http://orion:1026/v2/subscriptions"
    requests.request(
        "POST", url, headers=headers, data=json.dumps(sub_data))
    time.sleep(1)  # Fixing notification at insertion of favourite
    db.favourites.insert_one(favourite).inserted_id
    return Response("Favourite Added ", status=200)


@app.route("/favourites", methods=["DELETE"])
def delete_fav():
    try:
        user_id = request.args["user_id"]
        db.favourites.delete_many({'user_id': user_id})
        return Response('Deleted all user favourites', status=201)
    except:
        user_id = request.json['user_id']
        movie_id = request.json['movie_id']
        db.favourites.delete_one({"$and": [
            {"user_id": user_id},
            {"movie_id": movie_id}
        ]})
        return Response('Deleted Favourite', status=200)


@app.route("/favourites", methods=["GET"])
def get_favs():
    favourite_movies = []
    try:
        user_id = request.args['user_id']
        for favourite in db.favourites.find({'user_id': user_id}):
            favourite_movies.append(str(favourite['movie_id']))
    except:
        for favourite in db.favourites:
            favourite_movies.append({'user_id': favourite['user_id'],
                                     'movie_id': favourite['movie_id']})
    return jsonify(favourite_movies)


@app.route("/notification", methods=["POST"])
def send_notification():
    response = request.json['data']
    movie = response[0]
    movie_id = movie['id']
    for favourite in db.favourites.find({'movie_id': movie_id}):
        response = {
            "user_id": favourite['user_id'],
            "title": movie['title']
        }
        socketio.emit('notification', response)
    return Response("Notifications send", status=200)


if __name__ == "__main__":
    # app.run(debug=False)
    socketio.run(app, host="0.0.0.0", port=5001)
