# REST API v0.0.1



- [Auth](#auth)
	- [Login](#login)
	- [Signup](#signup)
	
- [List](#list)
	- [Get Lists](#get-lists)
	- [Create List](#create-list)
	- [Create List Item](#create-list-item)
	- [Delete List](#delete-list)
	- [Delete List Item](#delete-list-item)
	


# Auth

## Login

<p>Logs in a user.</p>

	POST /login


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>Email of the user.</p>							|
| password			| String			|  <p>Password of the user.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true,
        "token": "someauthtoken"
    }
}
```
Credentials-Wrong-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Incorrect password"
    }
}
```
## Signup

<p>Signs up a new user</p>

	POST /signup


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>Email of the user.</p>							|
| password			| String			|  <p>Password of the user.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true
    }
}
```
Email-taken-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "That email is already taken"
    }
}
```
# List

## Get Lists

<p>Returns all lists.</p>

	GET /lists


### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": [
        {
            "name": "mylist",
            "_id": "59e716c146f5d45e913479b1",
            "items": [
                {
                    "name": "itemname",
                    "_id": "59e7c71146f5d45e913479b5"
                },
                {
                    "name": "other_itemname",
                    "_id": "69e7c71146f5d45e913479b6"
                }
            ]
        }

    ]
}
```
Error-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Error message"
    }
}
```
## Create List

<p>Creates a new List.</p>

	POST /createlist


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| String			|  <p>Name of the list.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true
    }
}
```
Error-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Error message"
    }
}
```
## Create List Item

<p>Creates a new list item.</p>

	POST /createlistitem


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| listid			| String			|  <p>Id of the list.</p>							|
| itemname			| String			|  <p>Name of the list item.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true
    }
}
```
Error-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Error message"
    }
}
```
## Delete List

<p>Deletes a list.</p>

	POST /deletelist


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| String			|  <p>Id of the list.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true
    }
}
```
Error-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Error message"
    }
}
```
## Delete List Item

<p>Deletes a list item.</p>

	POST /deletelistitem


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| listid			| String			|  <p>Id of the list.</p>							|
| itemid			| String			|  <p>Id of the list item.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": true
    }
}
```
Error-Response:

```
HTTP/1.1 200 OK
{
    "body": {
        "success": false,
        "msg": "Error message"
    }
}
```

