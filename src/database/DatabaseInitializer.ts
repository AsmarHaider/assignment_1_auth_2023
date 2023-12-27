import {IDbClient} from "./IDbClient";
import {PostgresDbImpl} from "./implementations/postgres/PostGresDbImpl";
import {DatabaseConfigPostgres, DatabaseConfigSQLLiteMem} from "../config/ProjectConfig";
import {ProjectError, ProjectErrorCode} from "../models/ProjectError";
import {SqlLiteMemoryImpl} from "./implementations/sqlitemem/SqlLiteMemoryImpl";
import pgPromise from "pg-promise";
import {DataSource} from "typeorm";

/**
 * Singleton class for databases client initialization and access, following factory pattern.
 */
export class DatabaseInitializer {
    private static clientPostgres: PostgresDbImpl | null = null;
    private static clientSQLLite: SqlLiteMemoryImpl | null = null;

    /**
     * Asynchronously initializes the PostgreSQL client.
     * Ensures a single instance by checking if the client is already initialized.
     *
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     * @throws {ProjectError} Throws an error if the client cannot be initialized.
     */
    static async initializePostgres(): Promise<void> {
        if (this.clientPostgres === null) {
            this.clientPostgres = new PostgresDbImpl(DatabaseConfigPostgres);
            await this.clientPostgres.initialize(DatabaseConfigPostgres);
        }
    }


    /**
     * Asynchronously initializes the SQLite in memory client.
     * Ensures a single instance by checking if the client is already initialized.
     *
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     * @throws {ProjectError} Throws an error if the client cannot be initialized.
     */
    static async initializeSQLLiteMem(): Promise<void> {
        if (this.clientSQLLite === null) {
            this.clientSQLLite = new SqlLiteMemoryImpl(DatabaseConfigSQLLiteMem);
             await this.clientSQLLite.initialize(DatabaseConfigSQLLiteMem);
        }
    }

    /**
     * Retrieves the initialized PostgreSQL client.
     * Ensures the client is available before returning it.
     *
     * @returns {IDbClient} The initialized PostgreSQL client.
     * @throws {ProjectError} Throws an error if the client has not been initialized.
     */
    static getPostgresClient(): IDbClient<pgPromise.IDatabase<{}>> {
        if (this.clientPostgres === null) {
            throw new ProjectError("Database client is not initialized. please call initializePostgres()", ProjectErrorCode.DATABASE_NOT_INIT);
        }
        return this.clientPostgres;
    }

    /**
     * Retrieves the initialized SQLite in memory client.
     * Ensures the client is available before returning it.
     *
     * @returns {IDbClient} The initialized SQLite in memory client.
     * @throws {ProjectError} Throws an error if the client has not been initialized.
     */
    static getSQLMemClient(): IDbClient<DataSource> {
        if (this.clientSQLLite === null) {
            throw new ProjectError("Database client is not initialized. initializeSQLLiteMem()", ProjectErrorCode.DATABASE_NOT_INIT);
        }
          return this.clientSQLLite;
    }
}

