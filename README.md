# Project Overview

This project is a demonstration of my skills in TypeScript, SQLite (in memory via Type ORM), and PostgreSQL, highlighting my ability to integrate these technologies in a cohesive web application. For now authorization code is commented out for simplicity so headers can be ignored.

## Important Note on `.env` File
For ease of setup, a `.env` file is included in the documentation. However, I know that including `.env` files in repositories is generally not recommended for security reasons. To mitigate this, the `.env` file is also added to `.gitignore`.

## `.env` File Documentation
The `.env` file is structured as follows, and you may copy it or set the environment variables accordingly:

### General Configuration
- `PORT=3000`  
  **Description**: Specifies the port number on which the web server will listen for incoming connections.
- `AUTO_CREATE_TABLES=true`  
  **Description**: When true, the application will automatically create database tables if they don't exist.
- `AUTO_FILL_DATA=true`  
  **Description**: When true, the application will auto-populate the database with data, useful for testing or initial setup.

### SQLite Configuration
- `DATABASE_TYPE=sqlite_mem`  
  **Description**: Indicates the use of an in-memory SQLite database.

### PostgreSQL Configuration
- `DATABASE_TYPE=postgres`  
  **Description**: Indicates the use of an PostgreSQL database.
- `PG_DB_HOST=localhost`  
  **Description**: Hostname or IP address of the PostgreSQL server. 'localhost' indicates the server is running on the same machine.
- `PG_DB_PORT=5432`  
  **Description**: Port number on which the PostgreSQL server is listening. 5432 is the default port for PostgreSQL.
- `PG_DB_USER_NAME=postgres`  
  **Description**: Username for connecting to the PostgreSQL database. 'postgres' is a common default superuser account.
- `PG_DB_PASSWORD=abc123`  
  **Description**: Password for the specified PostgreSQL user.
- `PG_DB_NAME=postgres`  
  **Description**: Name of the PostgreSQL database to which the application will connect.

## Running the Project
To run the project, configure the `.env` file or env variables with the appropriate settings :

- **SQLite (In-memory)**: Use `DATABASE_TYPE=sqlite_mem` for SQLite in-memory database operations.
- **PostgreSQL**: If using PostgreSQL (`DATABASE_TYPE=postgres`), additional parameters like `PG_DB_HOST`, `PG_DB_PORT`, `PG_DB_USER_NAME`, `PG_DB_PASSWORD`, and `PG_DB_NAME` must be correctly set.

Ensure these settings are correctly configured in the `.env` file or env variables before running the project.


# API Documentation

## GET /auth/roles - Fetch All Roles
===================================

### Overview
------------
This endpoint retrieves a list of all roles within the system, 
including their unique IDs, names, and associated permissions.

### Request
-----------
**URL**: /auth/roles
**Method**: GET

**Headers**:
  - `Authorization`: Bearer token for authenticating the request.
    Format: `Bearer [your_token]`
  - `x-api-token`: Specific API token for additional security.

Response
--------
Status Code: 200 OK (on success).
Content-Type: application/json
Body: Array of roles (ID, name, permissions).

Example Response:
-----------------
```
[
{
    "id": "9faaf9ba-464e-4c68-a901-630fc4de123b",
    "name": "User",
    "permissions": []
},
{
    "id": "346a3cce-49d4-4e3c-bade-a16ed44b98bb",
    "name": "Administrator",
    "permissions": []
},
]
```
Error Response
--------------
Status Code: Depends on error (400, 401, 403, 500, etc.).
Content-Type: application/json
Body: JSON object with 'error' message and 'code'.

Example Error Response:
-----------------------
```
{
    "error": "Error message here",
    "code": "Error code here"
}
```

## GET /auth/permissions - Fetch All Permissions
===============================================

### Overview
------------
This endpoint retrieves a list of all permissions, including their IDs, names, effects, actions, resources, and descriptions.

### Request
-----------
**URL**: /auth/permissions
**Method**: GET

**Headers**:
  - `Authorization`: Bearer token for authenticating the request.
    Format: `Bearer [your_token]`
  - `x-api-token`: Specific API token for additional security.

### Response
------------
#### Success Response

**Status Code**:
  - `200 OK` on successful retrieval.

**Content-Type**:
  - `application/json`

**Body**:
  - An array of permissions, each with an ID, name, effect, action, resource, and description.

### Example Response
-------------------
```
[
    {
        "id": "0d6179fc-bc2f-4a50-bfd8-4ce4d10680f4",
        "name": "Permission 1",
        "effect": "Allow",
        "action": ["db:read"],
        "resource": "Database1",
        "description": "Allows reading from Database1"
    },
]
```

Error Response
--------------
Status Code: Depends on error (400, 401, 403, 500, etc.).
Content-Type: application/json
Body: JSON object with 'error' message and 'code'.

Example Error Response:
-----------------------
```
{
    "error": "Error message here",
    "code": "Error code here"
}

```


## PUT /auth/roles - Replace Role Permissions
============================================

### Overview
------------
This endpoint replaces all existing permissions of a specified role with the new permissions provided in the request. It returns the updated role object upon successful completion.

### Request
-----------
**URL**: /auth/roles
**Method**: PUT

**Headers**:
  - `Authorization`: Bearer token for authenticating the request.
    Format: `Bearer [your_token]`
  - `x-api-key`: Specific API token for additional security.

**Body**: 
A JSON object containing the `roleId` and a new array of permissions. This operation will replace all existing permissions of the role with those specified in the array.

**Example Request Body**:
 ```

{
    "roleId": "6f25f789-72f3-41e2-9561-b30ca19aa225",
    "permissions": [
        {
            "id": "0d6179fc-bc2f-4a50-bfd8-4ce4d10680f5",
            "name": "Permission 1",
            "effect": "Allow",
            "action": ["db:read"],
            "resource": "Database1",
            "description": "Allows reading from Database1"
        },
        {
            "id": "43f2ad9b-cafe-4175-ac26-ed7a5f1bf438",
            "name": "Permission 2",
            "effect": "Deny",
            "action": ["db:write"],
            "resource": "Database2",
            "description": "Denies writing to Database2"
        },
        {
            "id": "f9569347-80fb-454b-aea4-5d07781d7a7f",
            "name": "Permission 3",
            "effect": "Allow",
            "action": ["db:delete"],
            "resource": "Database3",
            "description": "Allows deleting from Database3"
        }
    ]
}

```

Response
--------
Status Code: 200 OK (on successful update).
Content-Type: application/json
Body: Updated role object with new permissions.

Example Response:
-----------------
```

{
    "roleId": "6f25f789-72f3-41e2-9561-b30ca19aa225",
    "permissions": [
        ... (updated permissions)
    ]
}

```

Error Response
--------------
Status Code: Depends on error (400, 401, 403, 404, 500, etc.).

Content-Type: application/json

Body: JSON object with 'error' message and 'code'.

Example Error Responses:
------------------------
Role Not Found:
```

{
    "error": "Role not found",
    "code": "ROLE_NOT_FOUND"
}

```
Invalid Permission IDs:

```
{
    "error": "Invalid permission IDs: [list of invalid IDs]",
    "code": "INVALID_PERMISSION"
}

```





