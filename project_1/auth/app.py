import os
import requests
import jwt
import datetime
import json
import enum

from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, Boolean
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

jwt_secret_key = "secret"

# Initialize Database
db = SQLAlchemy(app)

# User Roles Enumarator
class RoleEnum(enum.Enum):
    admin = 'Admin'
    cinemaowner = 'CinemaOwner'
    user = 'User'

# Database User Model
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.Enum(RoleEnum))
    is_confirmed = db.Column(db.Boolean, server_default=False, nullable=False)

    def json(self):
        return {"id": self.user_id, "username": self.username, "email": self.email, "password": self.password, "user_role": self.user_role}


# Create Database Table and Model
db.create_all()
db.session.commit()

# Initializing an admin user
admin_user = User(
    username = 'admin',
    email = 'admin@admin',
    password = generate_password_hash('admin', method='sha256'),
    user_role = RoleEnum.admin
)

# If Admin User is created on our db, we create one
user = db.session.query(User).filter_by(username=admin_user.username).first()
if user is None:
    db.session.add(admin_user)
    db.session.commit()


#------------Authentication API-----------#

# CreateUser API
@app.route("/auth/register", methods=["POST"])
def register():
    name = request.json['name']
    surname = request.json['surname']
    username = request.json['username']
    password = request.json['password']
    email = request.json['email']

    if request.json['role'] == 'admin':
        role = RoleEnum.admin
    elif request.json['role'] == 'cinemaowner':
        role = RoleEnum.cinemaowner
    else:
        role = RoleEnum.user

    # Checking Username and Email to be unique and Acceptable before procceding
    if username is None or email is None or password is None:
        error = 'username, email and password are required'
        return Response(error, status=400)
    if ' ' in username:
        error = 'Username should not contain spaces'
        return Response(error, status=400)
    else:
        user = db.session.query(User).filter_by(username=username).first()
        if user is not None:
            error = 'A User with the same username already exists'
            return Response(error, status=400)
        user = db.session.query(User).filter_by(email=email).first()
        if user is not None:
            error = 'A User with the same email already exists'
            return Response(error, status=400)
        user = User(
            name = name,
            surname = surname,
            username = username,
            email = email,
            password = generate_password_hash(password, method='sha256'),
            role = role ,
            is_confirmed = False
        )

        # Adding the User to the DB 
        db.session.add(user)
        db.session.commit()
        
        token = encodeAuthToken(user.username, user.role)
        # return token
        # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
        dec = decodeAuthToken(token)
        return Response("User created with token"+str(dec), status=200)


@app.route("/auth/login", methods=["POST"])
def login():
    username = request.json['username']
    password = request.json['password']
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    check_password = check_password_hash(user.password, password)
    if not check_password:
        error = 'Password is incorrect'
        return Response(error, status=400)
    token = encodeAuthToken(user.username, user.user_role)
    return token
    # REMEMBER TO REMOVE DECODE FROM HERE BEFORE PRODUCTION
    # dec = decodeAuthToken(token)
    # return Response('User Authenticated with token ' + str(dec), status=200)


@app.route("/auth/check_token", methods=["POST"])
def check_token():
    token = request.json['token']
    dec = decodeAuthToken(token)
    if dec['username'] is None:
        error = "Validation Unsuccessfull"
        return Response(error, status=400)
    response = {
        'username': dec['username'],
        'user_role': dec['user_role'],
    }
    return jsonify(response)


@app.route("/auth/change_role", methods=["POST"])
def change_role():
    username = request.json['username']
    user_role = request.json['user_role']
    if user_role != "admin" and user_role != "official":
        error = "This user role is not accepted: "+user_role
        return Response(error, status=400)
    user = db.session.query(User).filter_by(username=username).first()
    if user is None:
        error = 'A User with that username does not exist'
        return Response(error, status=400)
    if user.user_role == user_role:
        error = 'User already has this role'
        return Response(error, status=400)
    user.user_role = user_role
    db.session.commit()
    # Generate New Token
    token = encodeAuthToken(user.username, user.user_role)
    return token

# JWT TOKEN
def encodeAuthToken(username, user_role):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=60),
            'iat': datetime.datetime.utcnow(),
            'username': username,
            'user_role': user_role
        }
        token = jwt.encode(
            payload, jwt_secret_key, algorithm='HS256')
        return token
    except Exception as e:
        print(e)
        return e


def decodeAuthToken(token):
    try:
        payload = jwt.decode(
            token, jwt_secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Login please'
    except jwt.InvalidTokenError:
        return 'Nice try, invalid token. Login please'


if __name__ == "__main__":
    app.run(debug=False)
