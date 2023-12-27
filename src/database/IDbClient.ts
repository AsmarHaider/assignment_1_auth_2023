export type DbConfigPostgres = {
    host: string,
    port: number,
    database: string,
    user: string,
    password: string,
    ssl?: boolean,
    autoCreateTables:boolean,
    autoFillData:boolean
};

export type DbConfigSqlite = {

    //sqlite in memory
    type:'sqlite'
    database: string,
    synchronize: boolean,
    logging: boolean,
    autoFillData:boolean
};



/**
 * Interface for database client of choice
 */
export interface IDbClient<T>{
    /**
     * Getter for the  database instance.
     * Provides access to the initialized database for executing queries.
     *
     * @returns {T} The  database instance of choice set in environment variable.
     */
    get db(): T
}