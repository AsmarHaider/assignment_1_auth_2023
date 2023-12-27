import pgPromise from 'pg-promise';
import {ProjectError, ProjectErrorCode} from '../../../models/ProjectError';
import {DbConfigPostgres, IDbClient} from "../../IDbClient";
import {injectable} from "inversify";
import {demoPermissions, demoRoles} from "../../../models/demodata";

const pgp = pgPromise();


/**
 * Implementation of IDbClient for Postgres database using pg-promise.
 * Manages database connection and table operations.
 */
@injectable()
export class PostgresDbImpl implements IDbClient<pgPromise.IDatabase<{}>>{

    private _db: pgPromise.IDatabase<{}>;


    /**
     * Constructs a PostgresDbImpl instance with provided configuration.
     * @param config - Database configuration object.
     */
     public constructor(config: DbConfigPostgres) {
        this._db = pgp(config);
    }

    /**
     * Getter for the pg-promise database instance.
     * @returns The pg-promise database instance.
     */
    public get db(): pgPromise.IDatabase<{}> {
        return this._db;
    }


    /**
     * Initializes the PostgreSQL database.
     * Checks the database connection, optionally creates tables and fills them with demo data based on configuration.
     *
     * @param dbConfig - The configuration object for the PostgreSQL database, including flags for table creation and demo data.
     * @throws Throws a ProjectError with a specific error code if the database initialization fails.
     * @returns A Promise that resolves when the database initialization process is complete.
     */
    public  async initialize(dbConfig:DbConfigPostgres): Promise<void> {
            try {
                await this.checkConnection()
                if (dbConfig.autoCreateTables)
                    await this.createAllTables()

                 if(dbConfig.autoFillData)
                    await this.fillDemoData()

            } catch (error) {
                throw new ProjectError("Database initialization failed: " + error, ProjectErrorCode.ERROR_INIT_DATABASE);
            }
    }

    /**
     * Checks and establishes a database connection.
     * @throws {ProjectError} - On connection failure.
     */
    private async checkConnection(): Promise<void> {
        try {
            await this._db.connect();
            console.log("Successfully connected to the database.");
        } catch (error) {
            // Ensuring that the pool is properly closed even if an error occurs
            if (this._db.$pool) {
                 await this._db.$pool.end();
             }
        }
    }

    /**
     * Creates all necessary tables in the database.
     * @throws {ProjectError} - On error in creating tables.
     */
    private async createAllTables() {
        await this.createPermissionTable()
        await this.createRoleTable()
        await this.createRolePermissionTable()
    }

    /**
     * Inserts demo data into the database for testing purposes.
     * @throws {ProjectError} - On error in inserting demo data.
     */
    private async fillDemoData() {
        await this.insertDummyPermissions()
        await this.insertDummyRoles()
    }

    /**
     * Creates the permission table in the database if not exists
    * @throws {ProjectError} - On error in creating the permission table.
     */
    private async createPermissionTable() {
        try {
            const permissionTableResult = await this._db.oneOrNone("SELECT to_regclass('public.permission');");
            const permissionTableExists = permissionTableResult && permissionTableResult.to_regclass !== null;

            if (!permissionTableExists) {
                await this._db.none(`
               CREATE TABLE permission (
                id UUID PRIMARY KEY,
                name VARCHAR(256) NOT NULL,
                effect VARCHAR(15) NOT NULL,
                action VARCHAR(50)[] NOT NULL,
                resource VARCHAR(256) NOT NULL,
                description VARCHAR(500)
            );
        `);
                console.log("PermissionEntity table created.");
            }
        } catch (error) {
            throw new ProjectError("Error creating role table", ProjectErrorCode.TABLE_CREATION_ERROR);
        }
    }

    /**
     * Creates the role table in the database if table does not exists
     * @throws {ProjectError} - On error in creating the role table.
     */
    private async createRoleTable(): Promise<void> {
        try {
            const roleTableResult = await this._db.oneOrNone("SELECT to_regclass('public.role');");
            const roleTableExists = roleTableResult && roleTableResult.to_regclass !== null;
            if (!roleTableExists) {
                await this._db.none(`
                CREATE TABLE role (
                    uid UUID PRIMARY KEY,
                    name VARCHAR(256) NOT NULL
                );
            `);
                console.log("Role table created.");
            }
        } catch (error) {
            throw new ProjectError("Error creating role table", ProjectErrorCode.TABLE_CREATION_ERROR);
        }
    }

    /**
     * Creates the role_permission join table in the database if not exists
     * @throws {ProjectError} - On error in creating the role_permission table.
     */

    private async createRolePermissionTable() {
        try {
            const rolePermissionTableResult = await this._db.oneOrNone("SELECT to_regclass('public.role_permission');");
            const rolePermissionTableExists = rolePermissionTableResult && rolePermissionTableResult.to_regclass !== null;

            if (!rolePermissionTableExists) {
                await this._db.none(`
               CREATE TABLE role_permission (
                role_id UUID REFERENCES role(uid) ON DELETE CASCADE,
                permission_id UUID REFERENCES permission(id) ON DELETE CASCADE,
                PRIMARY KEY (role_id, permission_id)
            );
        `);
                console.log("Role-PermissionEntity table created.");
            }
        } catch (error) {
            throw new ProjectError("Error creating role table" + error, ProjectErrorCode.TABLE_CREATION_ERROR);
        }
    }

    /**
     * Inserts demo permissions into the database.
     * on conflict old data is replaced by the new data. This dummy data so thats why i did it. In prod it depends upon use cases
     * @throws {ProjectError} - On error in inserting demo permissions.
     */
    private async insertDummyPermissions(): Promise<void> {
        try {
            for (const perm of demoPermissions) {
                await this._db.none(`
                INSERT INTO permission (id, name, effect, action, resource, description)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    effect = EXCLUDED.effect,
                    action = EXCLUDED.action,
                    resource = EXCLUDED.resource,
                    description = EXCLUDED.description`,
                    [perm.id, perm.name, perm.effect, perm.action, perm.resource, perm.description]);
            }
            console.log("Dummy permissions inserted.");
        } catch (error) {
            throw new ProjectError("Error adding demo permissions to table" + error, ProjectErrorCode.DEMO_PERMISSION_ADDIING_TO_DB_ERROR);
        }
    }


    /**
     * Inserts demo roles into the database.
     * on conflict old data is replaced by the new data. This dummy data so thats why i did it. In prod it depends upon use cases
     * @throws {ProjectError} - On error in inserting demo roles.
     */
    private async insertDummyRoles(): Promise<void> {
        try {
            for (const role of demoRoles) {
                await this._db.none(`
                INSERT INTO role (uid, name) 
                VALUES ($1, $2)
                ON CONFLICT (uid) 
                DO UPDATE SET 
                    name = EXCLUDED.name`,
                    [role.id, role.name]);
            }
            console.log("Dummy roles inserted.");
        } catch (error) {
            throw new ProjectError("Error adding demo roles to table" + error, ProjectErrorCode.DEMO_ROLE_ADDING_TO_DB_ERROR);
        }
    }
}
