
# theCinemaDb API Documentation

# Introduction
This API was written for my project on cloud computing course at TUC.

# Overview
theCinema db API uses Fiware Pep-Proxy (Wilma) for proxy, Fiware Keyrock for user authentication, Fiware Orion and my Data-Storage for double and linked data storage in two seperate MongoDB's. 

# Authentication
Pep-Proxy uses X-Auth-Token to allow a request to be forwarded to the API. For user to service requests, X-Auth-Token is the user access token and for service to service request the X-Auth-Token has a pre-defined value.

# Error Codes
Authentication Error means almost guarenteed pep-proxy failure, so check your X-Auth-Token.

## Indices
* [Authentication](#authentication)
  * [Login via Keyrock](#12-login-via-keyrock)

* [Movies](#movies)
  * [Add a new movie](#2-add-a-new-movie)
  * [Delete a movie](#5-delete-a-movie)
  * [Edit a movie](#7-edit-a-movie)
  * [Fetch all movies](#8-fetch-all-movies)
  * [Fetch movies with optional queries](#10-fetch-movies-with-optional-queries)

* [Favourites](#favourites)
  * [Delete all user favourites](#6-delete-all-user-favourites)
  * [Get user favourites](#11-get-user-favourites)
  * [Update user favourite](#14-update-user-favourite)

* [Notifications](#notifications)
  * [Add a new notification - Working only direct from orion](#3-add-a-new-notification---working-only-direct-from-orion)
  * [Fetch all notifications](#9-fetch-all-notifications)
  * [Mark a notification as read](#13-mark-a-notification-as-read)

* [Cinemas](#cinemas)
  * [Add a new cinema](#1-add-a-new-cinema)
  * [Delete a cinema](#4-delete-a-cinema)


--------


## Authentication

### 1. Login via Keyrock


Server pings to port 80 and /idm/ proxy but outside the server you have to ping to port 3001


***Endpoint:***

```bash
Method: POST
Type: URLENCODED
URL: http://35.207.102.89:3001/oauth2/token
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/x-www-form-urlencoded |  |
| Authorization | Basic NTM4OTE4YjgtYjYyMS00YTc5LWI4YTctZTU5YWYxYjdlZWY1OmU5NzBmYjY3LWI1OWEtNDAwNS04NGQ3LTRlYmFjZWRhNjYxMg== | Basic base64(client_id:client_secret) |



***Body:***


| Key | Value | Description |
| --- | ------|-------------|
| grant_type | password |  |
| username | admin@test.com | User Email |
| password | 1234 | User Password |

## Movies

### 1. Add a new movie



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://35.207.102.89/data-storage/movies
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Body:***

```js        
{
    "cinema_name": "Village Cinema",
    "title": "Dawn of the Dead",
    "category": "Horror",
    "start_date": "2020-12-30",
    "end_date": "2021-12-30"
}
```


### 2. Delete a movie



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://35.207.102.89/data-storage/movies
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| movie_id | 5fdcd7f8d4198d872af08d69 | Movie ID |

### 3. Edit a movie



***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://35.207.102.89/data-storage/movies
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Body:***

```js        
{
    "movie_id": "5fdcd7f8d4198d872af08d69",
    "cinema_name": "Village Cinema",
    "title": "Shaun of the Dead",
    "category": "Comedy",
    "start_date": "2020-12-30",
    "end_date": "2021-12-30"
}
```



### 4. Fetch all movies



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://35.207.102.89/data-storage/movies
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |


### 5. Fetch movies with optional queries



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://35.207.102.89/data-storage/movies
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| search |  | Movie Title or Category  |
| date |  | Movie Date Search |
| cinema_name |  | Movie Cinema Search |



## Cinemas

### 1. Add a new cinema



***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://35.207.102.89/data-storage/cinemas
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | 127fb652b4618a8a4df948cf3adf6d92df46b958 | User Access Token |



***Body:***

```js        
{
    "user_id": "8b2284d5-6e82-4572-b99a-c44abbc93d77",
    "cinema_name": "My new cinema"
}
```

### 2. Delete a cinema


This also deletes all the movies that air on this cinema


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://35.207.102.89/data-storage/cinemas
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | 127fb652b4618a8a4df948cf3adf6d92df46b958 | User Access Token |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| cinema_name | My new cinema | The Cinema Name |


## Favourites

### 1. Get user favourites



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://35.207.102.89/data-storage/favourites
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| user_id | 39dbce1f-694c-4db7-8b58-15bc384f2b38 |  |



### 2. Update user favourite


If movie id is not on favourites list, it gets added.
If movie id is on the favourites list, it gets deleted.


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://35.207.102.89/data-storage/favourites
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Body:***

```js        
{
    "user_id": "39dbce1f-694c-4db7-8b58-15bc384f2b38",
    "movie_id": "5fdcbe57b215597003a75641",
    "title": "Ποτέ την Κυριακή"
}
```


### 3. Delete all user favourites



***Endpoint:***

```bash
Method: DELETE
Type: 
URL: http://35.207.102.89/data-storage/favourites
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| user_id | 39dbce1f-694c-4db7-8b58-15bc384f2b38 |  |



## Notifications


### 1. Add a new notification - Working only direct from orion


This endpoint is used by orion to post notifications so the required json formation is based on orion's responses


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: http://35.207.102.89/data-storage/notification
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | 127fb652b4618a8a4df948cf3adf6d92df46b958 | User Access Token |



***Body:***

```js        
{
    "data" : [{
        "id": "5fdcbe57b215597003a75641"
    }]
}
```


### 2. Fetch all notifications



***Endpoint:***

```bash
Method: GET
Type: 
URL: http://35.207.102.89/data-storage/notification
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | ae7bf14778850c53dbde07f6323592d19b2537ca | User Access Token |


### 3. Mark a notification as read


Updates the notification variable inside favourite collection to mark the favourite as no new notification


***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: http://35.207.102.89/data-storage/notification
```


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| X-Auth-Token | 127fb652b4618a8a4df948cf3adf6d92df46b958 | User Access Token |



***Body:***

```js        
{
    "user_id": "39dbce1f-694c-4db7-8b58-15bc384f2b38",
    "movie_id": "5fdcc0fad4198d872af08d67"
}
```



---
[Back to top](#thecinema-db)
> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2020-12-18 10:16:59 by [docgen](https://github.com/thedevsaddam/docgen)
