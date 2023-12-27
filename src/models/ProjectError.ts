
/**
 * Enumeration of standard error codes for the application.
 */
export enum ProjectErrorCode {
    "INVALID_INPUT"="INVALID_INPUT",
    ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
    PERMISSION_NOT_FOUND = 'PERMISSION_NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_PERMISSION = 'INVALID_PERMISSION',
    SERVER_ERROR="SERVER_ERROR",
    QUERY_ERROR="QUERY_ERROR",
    DATABASE_NOT_INIT="DATABASE_NOT_INITIALIZED",
    ERROR_INIT_DATABASE="ERROR_INITIALIZING_DATABASE",
    TABLE_CREATION_ERROR="TABLE_CREATION_ERROR",
    DEMO_PERMISSION_ADDIING_TO_DB_ERROR="DEMO_PERMISSION_ADDIING_TO_DB_ERROR",
    DEMO_ROLE_ADDING_TO_DB_ERROR="DEMO_ROLE_ADDING_TO_DB_ERROR",
    DATABASE_CONNECTION_CLOSE_ERROR="DATABASE_CONNECTION_CLOSE_ERROR",
    CONVERSION_ERROR_ACTION_ARRAY_TO_OBJECT="CONVERSION_ERROR_ACTION_ARRAY_TO_OBJECT"

}

/**
 * Custom error class for client errors.
 */
export class ProjectError extends Error {
    public readonly errorCode: ProjectErrorCode;
    public readonly errorData:any
    /**
     * Constructs a ProjectError.
     *
     * @param message - The error message.
     * @param errorCode - A custom error code identifying the type of error.
     * @param errorData
     */
    constructor(message: string, errorCode: ProjectErrorCode, errorData:any=null) {
        super(message);
        this.errorCode = errorCode;
        this.name = 'ProjectError';
    }
}
