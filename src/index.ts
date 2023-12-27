
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from "./routes/roleRoutes";
import {DatabaseInitializer} from "./database/DatabaseInitializer";
import * as dotenv from "dotenv";
import {InstanceProviderviaDI} from "./di_containers/InstanceProviderviaDI";
import {DATABASE_TYPES_FOR_PROJECT} from "./config/ProjectConfig";
const app = express();
dotenv.config();
const databaseType = process.env.DATABASE_TYPE;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use('/auth', authRoutes);

/**
 * Middleware for handling JSON parsing errors in Express.
 * This middleware checks for SyntaxErrors typically thrown when parsing invalid JSON data in requests.
 * If such an error is detected, it sends a 400 Bad Request response to the client.
 *
 * @param err - The error object caught by the middleware.
 * @param req - The Express request object.
 * @param res - The Express response object used to send a 400 response if a parsing error occurs.
 * @param next - The NextFunction callback to pass control to the next middleware.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Checking for SyntaxError and typical error message pattern
    //can be false positive cases but very rare in practice
    if (err instanceof SyntaxError && /JSON/.test(err.message)) {
        console.error(err);
        return res.status(400).send({ error: "Bad request. The JSON data is not properly formatted." });
    }
    next(err);
});


/**
 * General error handling middleware for Express.
 * This middleware logs the error stack and sends a 500 Internal Server Error response for any unhandled errors.
 *
 * @param err - The error object caught by the middleware.
 * @param req - The Express request object.
 * @param res - The Express response object used to send a 500 response for unhandled errors.
 * @param next - The NextFunction callback to pass control to the next middleware.
 */

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal server error!' });
});


/**
 * Starts the Express server on a specified port.
 * The server listens on the port defined in the environment variable PORT, or defaults to 8000.
 * It logs a message to the console once the server is running and listening for requests.
 */
const startServer = () => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};


/**
 * Initializes the database and sets up the dependency injection container.
 * The function determines the database type from the configuration and initializes the appropriate database.
 * It sets up the dependency injection container and starts the server.
 * In case of any failure during database initialization, it logs an error and exits the process.
 */
const  initDatabaseAndObjects=()=>{
    if (databaseType === DATABASE_TYPES_FOR_PROJECT.POSTGRES) {
        DatabaseInitializer.initializePostgres()
            .then(() => {

                InstanceProviderviaDI.setupContainer(databaseType)
                startServer();
                console.log("PostgreSQL database initialized successfully.");

            })
            .catch(error => {
                console.error("Failed to initialize the PostgreSQL database:", error);
                process.exit(1);
            });
    } else if(databaseType===DATABASE_TYPES_FOR_PROJECT.SQLITE_MEM){
        DatabaseInitializer.initializeSQLLiteMem()
            .then(() => {
                InstanceProviderviaDI.setupContainer(databaseType)
                startServer();
                console.log("SQLite in memory database initialized successfully.");

            })
            .catch(error => {
                console.error("Failed to initialize the SQLITE in memory database:", error);
                process.exit(1);
            });
    } else{
        console.error("No database mentioned to init. Please check your env variables:DATABASE_TYPE ");
        process.exit(1);
    }
}




initDatabaseAndObjects();





