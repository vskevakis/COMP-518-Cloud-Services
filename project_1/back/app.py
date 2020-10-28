import os
import requests
import datetime
import json
import enum

from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import Enum
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Application
app = Flask(__name__)

#---------Database Configuration-----------#

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
    cinema_name = db.Column(db.String(255), unique=True, nullable=False)
    category = db.Column(db.String(255), unique=True, nullable=False)

    def json(self):
        return {
            "movie_id": self.movie_id,
            "title": self.title,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "cinema_name": self.cinema_name,
            "category": self.category
        }


# Create Database Table and Model
db.create_all()
db.session.commit()

#------------Movies API-----------#

# CreateUser API
@app.route("/back/add_movie", methods=["POST"])
def add_movie():
    title = request.json['title']
    start_date = request.json['start_date']
    end_date = request.json['end_date']
    category = request.json['category']
    cinema_name = request.json['cinema_name']

    # Checking Username and Email to be unique and Acceptable before procceding

    movie = db.session.query(Movie).filter_by(title=title).first()
    if movie is not None:
        error = 'A movie with the same title already exists'
        return Response(error, status=400)
    movie = Movie(
        title=title,
        start_date=start_date,
        end_date=end_date,
        category=category,
        cinema_name=cinema_name,
    )

    # Adding the User to the DB
    db.session.add(movie)
    db.session.commit()
    return Response('Movie ' + str(movie.title) + 'added with success', status=200)


@app.route("/back/delete_movie", methods=["POST"])
def delete_movie():
    title = request.json['title']
    movie = db.session.query(Movie).filter_by(title=title).first()
    if title is None:
        error = 'A movie with that title does not exist'
        return Response(error, status=400)
    else:
        db.session.delete(movie)
        db.session.commit()
        return Response('Movie ' + str(movie.title) + ' deleted with success', status=200)


@app.route("/back/edit_movie", methods=["POST"])
def edit_movie():
    title = request.json['title']
    movie = db.session.query(Movie).filter_by(title=title).first()
    if title is None:
        error = 'A movie with that title does not exist'
        return Response(error, status=400)
    else:
        try:
            movie.title = request.json['new_title']
        except:
            movie.title = movie.title
        try:
            movie.start_date = request.json['start_date']
        except:
            movie.start_date = movie.start_date
        try:
            movie.end_date = request.json['end_date']
        except:
            movie.end_date = movie.end_date
        try:
            movie.cinema_name = request.json['cinema_name']
        except:
            movie.cinema_name = movie.cinema_name
        db.session.commit()
        return Response('Movie ' + str(movie.title) + ' edited with success', status=200)


if __name__ == "__main__":
    app.run(debug=False)
