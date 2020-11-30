import os
import requests
import datetime
import json
import enum
import redis
import re
from urllib.parse import urljoin
from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, func, and_, cast, DATE
# from sqlalchemy import Enum


# Initialize Application
app = Flask(__name__)

#---------Database Configuration-----------#

redisDB = redis.Redis(host=os.environ['REDIS_HOST'],
                      port=os.environ['REDIS_PORT'], db=os.environ['REDIS_DB'])

# Configuration of postgreSQL Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
    db=os.environ['POSTGRES_DB'])

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = 'my_secret_key'

# Initialize Database
db = SQLAlchemy(app)

# User Roles Enumarator


class RoleEnum(enum.Enum):
    admin = 'Admin'
    cinemaowner = 'CinemaOwner'
    user = 'User'

# Database Movie Model


class Movie(db.Model):
    __tablename__ = "movie"
    movie_id = db.Column(db.Integer, unique=True, primary_key=True)
    title = db.Column(db.String(255))
    start_date = db.Column(db.Date, default=datetime.date.today())
    end_date = db.Column(db.Date, default=datetime.date.today())
    cinema_name = db.Column(db.String(255), unique=False, nullable=False)
    category = db.Column(db.String(255), unique=False, nullable=False)
    poster_path = db.Column(db.String(255), unique=False, nullable=True)

    def json(self):
        return {
            "movie_id": self.movie_id,
            "title": self.title,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "cinema_name": self.cinema_name,
            "category": self.category,
            "poster_path": self.poster_path,
        }


# Create Database Table and Model
db.create_all()
db.session.commit()

#------------Movies API-----------#


def get_poster(title):
    try:
        response = requests.get(
            "https://api.themoviedb.org/3/search/movie?api_key=ef959111db7fa4c60077b43c0c0a157e&language=en-US&query="+title+"&page=1&include_adult=false")
        tmdb = response.json()
        tmdb_path = json.dumps(tmdb["results"][0]["poster_path"])
        tmdb_poster = str(
            "https://image.tmdb.org/t/p/w300_and_h450_bestv2") + str(tmdb_path.replace("\"", ""))
        return tmdb_poster
    except:
        # Easter Egg in case request fail or doesn't return items
        tmdb_poster = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/y8Bd0twmeLpdbHn2ZBlrhzfddUf.jpg"
        return tmdb_poster

# CreateUser API
@app.route("/back/add_movie", methods=["POST"])
def add_movie():
    title = request.json['title']
    start_date = request.json['start_date']
    end_date = request.json['end_date']
    category = request.json['category']
    cinema_name = request.json['cinema_name']
    user_role = request.json['user_role']

    # if user_role is not ("cinemaowner" or "admin"):  # Need to remove Admin From Here
    #     error = 'You do not have authorization to add movie'
    #     return Response(error, status=400)

    movie = db.session.query(Movie).filter_by(
        title=title).filter_by(cinema_name=cinema_name).first()
    if movie is not None:
        error = 'A movie with the same title already exists'
        return Response(error, status=400)
    # try:
    #     response = requests.get(
    #         "https://api.themoviedb.org/3/search/movie?api_key=ef959111db7fa4c60077b43c0c0a157e&language=en-US&query="+title+"&page=1&include_adult=false")
    #     tmdb = response.json()
    #     tmdb_id = json.dumps(tmdb["results"][0]["id"])
    # except:
    #     tmdb_id = 45649  # Easter Egg in case request fail or doesn't return items
    poster_path = get_poster(title)
    movie = Movie(
        title=title,
        start_date=start_date,
        end_date=end_date,
        category=category,
        cinema_name=cinema_name,
        poster_path=poster_path,
    )

    # Adding the User to the DB
    db.session.add(movie)
    db.session.commit()
    return Response('Movie ' + str(movie.title) + 'added with success', status=200)


@app.route("/back/delete_movie", methods=["POST"])
def delete_movie():
    movie_id = request.json['movie_id']
    movie = db.session.query(Movie).filter_by(movie_id=movie_id).first()
    if movie is None:
        error = 'A movie with that title does not exist'
        return Response(error, status=400)
    else:
        db.session.delete(movie)
        db.session.commit()
        return Response('Movie ' + str(movie.title) + ' deleted with success', status=200)


@app.route("/back/edit_movie", methods=["POST"])
def edit_movie():
    id = request.json['movie_id']
    movie = db.session.query(Movie).filter_by(movie_id=int(id)).first()
    if id is None:
        error = 'A movie with that id does not exist'
        return Response(error, status=400)
    else:
        try:
            title = request.json['title']
            if title:
                movie.title = title
                movie.poster_path = get_poster(movie.title)
        except:
            movie.title = movie.title
        try:
            start_date = request.json['start_date']
            if start_date:
                movie.start_date = start_date
        except:
            movie.start_date = movie.start_date
        try:
            end_date = request.json['end_date']
            if end_date:
                movie.end_date = end_date
        except:
            movie.end_date = movie.end_date
        try:
            category = request.json['category']
            if category:
                movie.category = category
        except:
            movie.category = movie.category
        db.session.commit()
        return Response('Movie ' + str(movie.title) + ' edited with success', status=200)


@app.route("/back/get_movies", methods=["GET"])
def get_movies():
    movies = db.session.query(Movie).order_by(Movie.title.asc()).all()
    movies_list = []
    for movie in movies:
        movies_list.append({'movie_id': movie.movie_id,
                            'title': movie.title,
                            'category': movie.category,
                            'start_date': movie.start_date,
                            'end_date': movie.end_date,
                            'cinema_name': movie.cinema_name,
                            'poster_path': movie.poster_path,
                            })
    return jsonify(movies_list)


@app.route("/back/search_movies", methods=["POST"])
def search_movies():
    search_query = request.json['search']
    try:
        search_date = request.json['date']
        search_query = str("%"+search_query+"%")
        date = datetime.datetime.strptime(search_date, '%Y-%m-%d')
        movies = db.session.query(Movie).filter(or_(Movie.title.ilike(search_query),  Movie.category.ilike(
            search_query),  Movie.cinema_name.ilike(search_query)), (and_(Movie.start_date <= date, Movie.end_date >= date)))
    except:
        movies = db.session.query(Movie).filter(or_(Movie.title.ilike(search_query),  Movie.category.ilike(
            search_query),  Movie.cinema_name.ilike(search_query)))
    # search_query = request.json['search']
    # search_query = str("%"+search_query+"%")
    # movies = db.session.query(Movie).filter(or_(Movie.title.ilike(search_query),  Movie.category.ilike(
    #     search_query),  Movie.cinema_name.ilike(search_query)))
    # try:
    #     search_date = request.json['date']
    #     date = datetime.datetime.strptime(search_date, '%Y-%m-%d')
    #     movies = movies.filter(
    #         and_(Movie.start_date <= date, Movie.end_date >= date))
    # except:
    #     pass
    movies = movies.order_by(Movie.title.asc()).all()
    movies_list = []
    for movie in movies:
        # if movie.start_date >= date and movie.end_date <= date:
        movies_list.append({'movie_id': movie.movie_id,
                            'title': movie.title,
                            'category': movie.category,
                            'start_date': movie.start_date,
                            'end_date': movie.end_date,
                            'cinema_name': movie.cinema_name,
                            'poster_path': movie.poster_path,
                            })
    return jsonify(movies_list)


@app.route("/back/search_cinema_movies", methods=["POST"])
def search_cinema_movies():
    search_query = request.json['search']
    cinema = request.json['cinema']
    movies = db.session.query(Movie).filter_by(cinema_name=cinema)
    search_query = str("%"+search_query+"%")
    try:
        search_date = request.json['date']
        date = datetime.datetime.strptime(search_date, '%Y-%m-%d')
        movies = movies.filter(or_(Movie.title.ilike(search_query),  Movie.category.ilike(
            search_query)), (and_(Movie.start_date <= date, Movie.end_date >= date)))
    except:
        movies = movies.filter(or_(Movie.title.ilike(search_query),  Movie.category.ilike(
            search_query)))

    # try:
    #     search_date = request.json['date']
    #     date = datetime.datetime.strptime(
    #         search_date, '%a, %-d %b %Y ')
    #     movies = movies.filter_by(start_date <= date)
    # except:
    #     pass

    movies = movies.order_by(Movie.title.asc()).all()
    movies_list = []
    for movie in movies:
        # if movie.start_date >= date and movie.end_date <= date:
        movies_list.append({'movie_id': movie.movie_id,
                            'title': movie.title,
                            'category': movie.category,
                            'start_date': movie.start_date,
                            'end_date': movie.end_date,
                            'cinema_name': movie.cinema_name,
                            'poster_path': movie.poster_path,
                            })
    return jsonify(movies_list)


@app.route("/back/modify_fav", methods=["POST"])
def modify_fav():
    user_id = request.json['user_id']
    movie_id = request.json['movie_id']
    if (redisDB.srem(user_id, movie_id)):
        response = True
    else:
        redisDB.sadd(user_id, movie_id)
        response = False
    return json.dumps(response)


@app.route("/back/get_favs", methods=["POST"])
def get_favs():
    user_id = request.json['user_id']
    movies = redisDB.smembers(user_id)
    try:
        results = re.split("[{' 'b,}]", str(movies))
        response = []
        for result in results:
            if (result != ""):
                response.append(int(result))
        return json.dumps(response)
    # movies = movies[1]
    except:
        response = []
    return json.dumps(response)


if __name__ == "__main__":
    app.run(debug=False)
