# Project Overview

This project is a demonstration of my skills in TypeScript, SQLite, and PostgreSQL, highlighting my ability to integrate these technologies in a cohesive web application.

## Important Note on `.env` File
For ease of setup, a `.env` file is included in the documentation. However, it's important to note that including `.env` files in repositories is generally not recommended for security reasons. To mitigate this, the `.env` file is also added to `.gitignore`.

## `.env` File Documentation
The `.env` file is structured as follows, and you may copy it or set the environment variables accordingly:

### General Configuration
- `PORT=3000`  
  **Description**: Specifies the port number on which the web server will listen for incoming connections.

### SQLite Configuration
- `DATABASE_TYPE=sqlite_mem`  
  **Description**: Indicates the use of an in-memory SQLite database.
- `AUTO_CREATE_TABLES=true`  
  **Description**: When true, the application will automatically create database tables if they don't exist.
- `AUTO_FILL_DATA=true`  
  **Description**: When true, the application will auto-populate the database with data, useful for testing or initial setup.

### PostgreSQL Configuration
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
To run the project, configure the `.env` file with the appropriate settings:

- **SQLite (In-memory)**: Use `DATABASE_TYPE=sqlite_mem` for SQLite in-memory database operations.
- **PostgreSQL**: If using PostgreSQL (`DATABASE_TYPE=postgres`), additional parameters like `PG_DB_HOST`, `PG_DB_PORT`, `PG_DB_USER_NAME`, `PG_DB_PASSWORD`, and `PG_DB_NAME` must be correctly set.

Ensure these settings are correctly configured in the `.env` file before running the project.
