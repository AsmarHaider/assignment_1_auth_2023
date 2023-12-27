import
{DbConfigPostgres, DbConfigSqlite} from "../database/IDbClient";
import * as dotenv from 'dotenv';

//getting environment variables from the env file
dotenv.config();




//freezing object so that it cannot be changed
export const DATABASE_TYPES_FOR_PROJECT = Object.freeze({
    POSTGRES: "postgres",
    SQLITE_MEM:"sqlite_mem"
});

/**
 * Database configuration settings postgres.
 */
export const DatabaseConfigPostgres: DbConfigPostgres = {
    /**
     * Hostname of the postgres database server, a URL or IP address.
     * Sourced from the PG_DB_HOST environment variable.
     */
    host: process.env.PG_DB_HOST!,

    /**
     * Port number on which the postgres database server is listening.
     * Sourced from the PG_DB_PORT environment variable.
     */
    port: Number(process.env.PG_DB_PORT!),

    /**
     * Username used for postgres database authentication.
     * Sourced from the PG_DB_USER_NAME environment variable.
     */
    user: process.env.PG_DB_USER_NAME!,

    /**
     * Password for the database user.
     * Sourced from the PG_DB_PASSWORD environment variable.
     */
    password: process.env.PG_DB_PASSWORD!,

    /**
     * Name of the database to connect to on the server.
     * Sourced from the PG_DB_NAME environment variable.
     */
    database: process.env.PG_DB_NAME!,

    /**
     * Flag to determine whether tables should be automatically created if they do not exist.
     * Sourced from the AUTO_CREATE_TABLES environment variable.
     */
    autoCreateTables: process.env.AUTO_CREATE_TABLES ? process.env.AUTO_CREATE_TABLES === 'true' : false,

    /**
     * Flag to determine whether the database should be auto-filled with data.
     * Sourced from the AUTO_FILL_DATA environment variable.
     */
    autoFillData: process.env.AUTO_FILL_DATA ? process.env.AUTO_FILL_DATA === 'true' : false
};



export const DatabaseConfigSQLLiteMem: DbConfigSqlite = {
    //constant sqlite database
    type: 'sqlite',

    //we chose in memory according to the assignment
    database: "memory",


    //set logging true or false for db logs
    logging: process.env.DB_LOGGING ? process.env.DB_LOGGING === 'true' : false,

    //auto create tables, I will set to true for demonstration purpose of assignment but not recommend it for real production system
    synchronize: process.env.AUTO_CREATE_TABLES ? process.env.AUTO_CREATE_TABLES === 'true' : false,


    //to auto fill the demo data
    autoFillData:process.env.AUTO_FILL_DATA ? process.env.AUTO_FILL_DATA === 'true' : false
};