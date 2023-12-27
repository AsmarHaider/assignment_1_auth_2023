# Project Overview

This project is a demonstration of my skills in TypeScript, SQLlite, and PostgreSQL.

## Important Note on .env File:
For your convenience, I have included a .env file in the documentation. However, I understand that including .env files in a repository is not recommended due to security reasons. To address this, the .env file is also added to .gitignore.

## .env File Documentation:

The .env file is structured as follows: you can copy it or set the env variables according to that.

PORT=3000                   #### Specifies the port number on which the web server will listen for incoming connections.

### SQLite Configuration
DATABASE_TYPE=sqlite_mem     #### Indicates the type of database being used. Here, 'sqlite_mem' suggests an in-memory SQLite database.
AUTO_CREATE_TABLES=true      #### This flag, when set to true, indicates that the application should automatically create database tables if they don't exist.
AUTO_FILL_DATA=true          #### When set to true, this suggests that the application should auto-populate the database with data, useful for testing or initial setup.

### PostgreSQL Configuration
PG_DB_HOST=localhost         #### The hostname or IP address of the PostgreSQL server. 'localhost' means the server is running on the same machine.
PG_DB_PORT=5432              #### The port number on which the PostgreSQL server is listening. 5432 is the default port for PostgreSQL.
PG_DB_USER_NAME=postgres     #### Username for connecting to the PostgreSQL database. 'postgres' is often used as the default superuser account.
PG_DB_PASSWORD=abc123        #### Password for the PostgreSQL user specified above.
PG_DB_NAME=postgres          #### Name of the PostgreSQL database to which the application will connect.


## Running the Project
To run the project, you need to select the port and the database type. There are two database options available:

***SQLite (In-memory):*** Specify DATABASE_TYPE=sqlite_mem for SQLite in-memory operations.
***PostgreSQL:*** If you choose PostgreSQL (DATABASE_TYPE=postgres), you must set up additional parameters such as PG_DB_HOST, PG_DB_PORT, PG_DB_USER_NAME, PG_DB_PASSWORD, and PG_DB_NAME.

### Please ensure you configure these settings correctly in the .env file before running the project.


