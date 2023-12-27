import { Container } from 'inversify';
import 'reflect-metadata';
import {IRoleRepository} from "../repositories/IRoleRepository";
import {PostgresRoleRepositoryImpl} from "../repositories/implemetations/PostgresRoleRepositoryImpl";
import {IRoleService} from "../services/IRoleService";
import {RoleServiceImpl} from "../services/implementations/RoleServiceImpl";
import {IDbClient} from "../database/IDbClient";
import {DataSource} from "typeorm";
import {DatabaseInitializer} from "../database/DatabaseInitializer";
import pgPromise from "pg-promise";
import {SQLiteRoleRepositoryImpl} from "../repositories/implemetations/SQLiteRoleRepositoryImpl";
import {DATABASE_TYPES_FOR_PROJECT} from "../config/ProjectConfig";


export class InstanceProviderviaDI {
    private static container: Container | null = null;

    /**
     * Sets up the dependency injection container with bindings based on the specified database type.
     * This method initializes the container only once, ignoring subsequent calls.
     *
     * @param databaseType - A string identifier for the database type (e.g., SQLite in-memory, PostgreSQL).
     * @throws Throws an Error if an unknown database type is provided.
     */
    public static setupContainer(databaseType: string): void {
        if (this.container !== null) {
            return; // If already set up, don't reinitialize
        }

        this.container = new Container();

        switch (databaseType) {
            case DATABASE_TYPES_FOR_PROJECT.SQLITE_MEM:
                this.container.bind<IDbClient<DataSource>>("IDbClient")
                    .toConstantValue(DatabaseInitializer.getSQLMemClient());

                this.container.bind<IRoleRepository>("IRoleRepository")
                    .to(SQLiteRoleRepositoryImpl)
                    .inSingletonScope();
                break;
            case DATABASE_TYPES_FOR_PROJECT.POSTGRES:
                this.container.bind<IDbClient<pgPromise.IDatabase<{}>>>("IDbClient")
                    .toConstantValue(DatabaseInitializer.getPostgresClient());

                this.container.bind<IRoleRepository>("IRoleRepository")
                    .to(PostgresRoleRepositoryImpl)
                    .inSingletonScope();
                break;
            default:
                throw new Error(`Unknown REPOSITORY_TYPE: ${databaseType}`);
        }

        this.container.bind<IRoleService>("IRoleService").to(RoleServiceImpl).inSingletonScope();
    }

    /**
     * Retrieves the initialized dependency injection container.
     * This method is used to access the container and its bindings across the application.
     *
     * @throws Throws an Error if the container has not been initialized yet.
     * @returns The initialized Container instance.
     */
    public static getContainer(): Container {
        if (this.container === null) {
            throw new Error("Container has not been initialized. Call setupContainer first.");
        }
        return this.container;
    }
}
