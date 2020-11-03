import os
import requests
import jwt
import datetime
import json
import enum

from flask import Flask, jsonify, Response, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, func, and_, cast, DATE
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
    user_id = db.Column(db.Integer, unique=True,
                        primary_key=True, nullable=False, autoincrement=True)
    name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.Enum(RoleEnum))
    is_confirmed = db.Column(db.Boolean, default=False, nullable=False)

    def json(self):
        return {
            "id": self.user_id,
            "name": self.name,
            "surname": self.surname,
            "username": self.username,
            "password": self.password,
            "email": self.email,
            "role": self.role,
            "is_confirmed": self.is_confirmed
        }


# Create Database Table and Model
db.create_all()
db.session.commit()

# Initializing an admin user
admin_user = User(
    name='Admin',
    surname='Admin',
    username='admin',
    email='admin@admin',
    password=generate_password_hash('admin', method='sha256'),
    role=RoleEnum.admin,
    is_confirmed=True
)

# If Admin User is created on our db, we create one
user = db.session.query(User).filter_by(username=admin_user.username).first()
if user is None:
    db.session.add(admin_user)
    db.session.commit()

# Initializing an cinema owner user
cinema_owner = User(
    name='Makis',
    surname='Cinemakis',
    username='attikon',
    email='attikon@cinema',
    password=generate_password_hash('attikon', method='sha256'),
    role=RoleEnum.cinemaowner,
    is_confirmed=True
)

# If Admin User is created on our db, we create one
user = db.session.query(User).filter_by(username=cinema_owner.username).first()
if user is None:
    db.session.add(cinema_owner)
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

    if request.json['user_role'] == 'Admin':
        role = RoleEnum.admin
    elif request.json['user_role'] == 'Cinema Owner':
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
            name=name,
            surname=surname,
            username=username,
            email=email,
            password=generate_password_hash(password, method='sha256'),
            role=role,
            is_confirmed=False
        )

        # Adding the User to the DB
        db.session.add(user)
        db.session.commit()
        if (user.role == RoleEnum.admin):
            token = encodeAuthToken(
                user.username, "admin", user.is_confirmed, user.user_id)
        elif(user.role == RoleEnum.cinemaowner):
            token = encodeAuthToken(
                user.username, "cinemaowner", user.is_confirmed, user.user_id)
        else:
            token = encodeAuthToken(
                user.username, "user", user.is_confirmed, user.user_id)
        return token
    # Only for Debugging Reasons
    # dec = decodeAuthToken(token)
    # return Response("User created with role "+str(user_role), status=200)


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
    if (user.role == RoleEnum.admin):
        token = encodeAuthToken(user.username, "admin",
                                user.is_confirmed, user.user_id)
    elif(user.role == RoleEnum.cinemaowner):
        token = encodeAuthToken(
            user.username, "cinemaowner", user.is_confirmed, user.user_id)
    else:
        token = encodeAuthToken(user.username, "user",
                                user.is_confirmed, user.user_id)
    return token
    # Only for Debugging Reasons
    # dec = decodeAuthToken(token)
    # return Response('User Authenticated with token ' + str(dec), status=200)


@app.route("/check_token", methods=["POST"])
def check_token():
    token = request.json['token']
    dec = decodeAuthToken(token)
    if dec['username'] is None:
        error = "Validation Unsuccessfull"
        return Response(error, status=400)
    response = {
        'username': dec['username'],
        'role': dec['role'],
        'is_confirmed': dec['is_confirmed']
    }
    return jsonify(response)


@app.route("/auth/delete_user", methods=["POST"])
def delete_user():
    user_id = request.json['user_id']
    role = request.json['user_role']
    if role != "admin":
        error = "You don\'t have the authorization to delete users"
        return Response(error, status=301)
    user = db.session.query(User).filter_by(user_id=user_id).first()
    if user.role == "admin":
        error = "User [" + user.username + "] is admin and cannot be deleted"
        return Response(error, status=302)
    else:
        db.session.delete(user)
        db.session.commit()
        return 'User Removed with Success'


@app.route("/auth/accept_user", methods=["POST"])
def accept_user():
    user_id = request.json['user_id']
    role = request.json['user_role']
    if role != "admin":
        error = "You don\'t have the authorization to accept users"
        return Response(error, status=301)
    user = db.session.query(User).filter_by(user_id=user_id).first()
    if user.is_confirmed:
        error = "User [" + user.username + "] is already accepted"
        return Response(error, status=302)
    else:
        user.is_confirmed = True
        db.session.commit()
    return 'User Accepted with Success'


@app.route("/auth/get_users", methods=["POST"])
def get_users():
    search_query = request.json['search']
    search_query = str("%"+search_query+"%")
    users = db.session.query(User).filter(or_(User.username.ilike(search_query), User.name.ilike(
        search_query), User.surname.ilike(search_query), User.email.ilike(search_query))).order_by(User.role.asc()).order_by(User.surname).all()
    users_list = []
    for user in users:
        users_list.append({
            'user_id': user.user_id,
            'role': str(user.role.value),
            'surname': user.surname,
            'name': user.name,
            'username': user.username,
            'email': user.email,
            'is_confirmed': user.is_confirmed
        })
    return jsonify(users_list)


# @app.route("/auth/change_role", methods=["POST"])
# def change_role():
#     username = request.json['username']
#     role = request.json['role']
#     if role != "admin" and role != "official":
#         error = "This user role is not accepted: "+role
#         return Response(error, status=400)
#     user = db.session.query(User).filter_by(username=username).first()
#     if user is None:
#         error = 'A User with that username does not exist'
#         return Response(error, status=400)
#     if user.role == role:
#         error = 'User already has this role'
#         return Response(error, status=400)
#     user.role = role
#     db.session.commit()
#     # Generate New Token
#     token = encodeAuthToken(user.username, user.role, user.is_confirmed)
#     return token

# JWT TOKEN


def encodeAuthToken(username, role, is_confirmed, user_id):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=60),
            'iat': datetime.datetime.utcnow(),
            'username': username,
            'role': role,
            'is_confirmed': is_confirmed,
            'user_id': user_id
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
            token, jwt_secret_key, algorithm='HS256')
        return payload
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Login please'
    except jwt.InvalidTokenError:
        return 'Nice try, invalid token. Login please'


if __name__ == "__main__":
    app.run(debug=False)
