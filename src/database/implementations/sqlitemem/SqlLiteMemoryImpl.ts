import { DataSource } from 'typeorm';
import { demoPermissions, demoRoles } from "../../../models/demodata";
import {DbConfigSqlite, IDbClient} from "../../IDbClient";
import { ProjectError, ProjectErrorCode } from "../../../models/ProjectError";
import {RoleEntity} from "./entities/RoleEntity";
import {PermissionEntity} from "./entities/PermissionEntity";
import {RolePermissionEntity} from "./entities/RolePermissionEntity";


export class SqlLiteMemoryImpl implements IDbClient<DataSource> {
    private readonly dataSource: DataSource;

    /**
     * Constructs an instance of SqlLiteMemoryImpl.
     * Initializes the DataSource with the provided SQLite configuration.
     *
     * @param config - The configuration object for SQLite database.
     */
    public constructor(private config:DbConfigSqlite) {
        this.dataSource = new DataSource({
            type: config.type,
            database: config.database,
            entities: [RoleEntity, PermissionEntity, RolePermissionEntity],
            synchronize: this.config.synchronize,
            logging: config.logging
        });
    }

    /**
     * Initializes the SQLite in-memory database.
     * Optionally fills the database with demo data if 'autoFillData' is set in the configuration.
     *
     * @param dbConfig - The configuration object for the database initialization.
     * @throws Throws a ProjectError if the database initialization fails.
     * @returns A Promise that resolves when the database is initialized.
     */
    public async initialize(dbConfig:DbConfigSqlite): Promise<void> {
        try {
            await this.dataSource.initialize();
            if (dbConfig.autoFillData) {
                await this.fillDemoData();
            }
        } catch (error) {
            throw new ProjectError('Database initialization failed '+error, ProjectErrorCode.DATABASE_NOT_INIT);
        }
    }


    /**
     * Getter for accessing the initialized DataSource instance.
     *
     * @throws Throws a ProjectError if the database is not initialized.
     * @returns The DataSource instance if initialized.
     */
    public get db(): DataSource {
        if (!this.dataSource.isInitialized) {
            throw new ProjectError('Database not initialized', ProjectErrorCode.DATABASE_NOT_INIT);
        }
        return this.dataSource;
    }

    /**
     * Fills the database with demo data for roles and permissions.
     * Utilizes the repositories of RoleEntity and PermissionEntity to persist demo data.
     *
     * @returns A Promise that resolves when the demo data is filled.
     */
    private async fillDemoData(): Promise<void> {
        const roleRepository = this.dataSource.getRepository(RoleEntity);
        const permissionRepository = this.dataSource.getRepository(PermissionEntity);

        for (const roleData of demoRoles) {

            //auto inferring the types
            const role = roleRepository.create(roleData);
            await roleRepository.save(role);
        }

        for (const permData of demoPermissions) {
            const permission = permissionRepository.create({
                ...permData,
                action: permData.action.join(',')
            });
            await permissionRepository.save(permission);
        }

    }


}
