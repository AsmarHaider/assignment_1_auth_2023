import {IRoleRepository} from '../IRoleRepository';
import {Role, RoleId} from '../../models/role';
import {AuthenticationAction, DatabaseAction, Permission} from '../../models/permission';
import {ProjectError, ProjectErrorCode} from "../../models/ProjectError";
import {IDbClient} from "../../database/IDbClient";
import {inject, injectable} from "inversify";
import pgPromise from "pg-promise";

/**
 * This repository handles the operations related to roles and permissions
 * in a PostgreSQL database.
 */

@injectable()
export class PostgresRoleRepositoryImpl implements IRoleRepository {
    private dbClient: IDbClient<pgPromise.IDatabase<{}>>;

    constructor(@inject("IDbClient") dbClient: IDbClient<pgPromise.IDatabase<{}>>) {
        this.dbClient = dbClient;
    }
    /**
     * Retrieves all roles stored in the PostgreSQL database.
     *
     * @returns A promise that resolves to an array of Role objects.
     */
    public async getRoles(): Promise<Role[]> {

            const query = `
                SELECT r.uid, r.name, p.id as permission_id, p.name as permission_name, p.effect, p.action, p.resource, p.description 
                FROM role r
                LEFT JOIN role_permission rp ON r.uid = rp.role_id
                LEFT JOIN permission p ON rp.permission_id = p.id;
            `;
            const result = await this.dbClient.db.query(query);
            // Transform result into Role objects with Permissions
            return this.transformToRoleObjects(result);
    }

    private transformToRoleObjects(roleData: any[]): Role[] {
        const rolesMap = new Map<RoleId, Role>();

        roleData.forEach(row => {
            let role = rolesMap.get(row.uid);

            if (!role) {
                role = {
                    id: row.uid,
                    name: row.name,
                    permissions: []
                };
                rolesMap.set(row.uid, role);
            }

            if (row.permission_id){
                role.permissions.push(this.convertToPermissionObject(row));
            }

        });

        return Array.from(rolesMap.values());
    }

    private convertToPermissionObject(row: any): Permission {

        //making it compatible for both quries
        const permissionId = row.permission_id ?? row.id;
        //making it compatible for both quries
        const permissionName = row.permission_name ?? row.name;
        const permissionEffect = row.effect;
        const permissionAction = row.action;
        const permissionResource = row.resource;
        const permissionDescription = row.description;

        const actionsArray = permissionAction ? this.getPermissionActionObj(permissionAction) : [];

        return {
            id: permissionId,
            name: permissionName,
            effect: permissionEffect,
            action: actionsArray,
            resource: permissionResource,
            description: permissionDescription
        };
    }

    private getPermissionActionObj(actions: string[]): DatabaseAction[] | AuthenticationAction[] {

        const firstAction = actions[0];
        if (Object.values(DatabaseAction).includes(firstAction as DatabaseAction)) {
            return actions as DatabaseAction[];
        } else if (Object.values(AuthenticationAction).includes(firstAction as AuthenticationAction)) {
            return actions as AuthenticationAction[];
        } else {
            throw new ProjectError("Error Converting database string array to object:action "+actions, ProjectErrorCode.CONVERSION_ERROR_ACTION_ARRAY_TO_OBJECT);
        }
    }


    /**
     * Fetches all available permissions stored in the PostgreSQL database.
     *
     * @returns A promise that resolves to an array of PermissionEntity objects.
     */
   public async getPermissions(): Promise<Permission[]> {
        try {
            const query = 'SELECT * FROM permission';
            const result = await this.dbClient.db.query(query);
            return result.map(this.convertToPermissionObject.bind(this));
        } catch (error) {
            console.error("Error fetching permissions:", error);
            throw new ProjectError("Error fetching permissions from the database", ProjectErrorCode.QUERY_ERROR);
        }
    }

    /**
     * Sets the permissions for a specified role in the database.
     *
     * @param roleId - The unique identifier of the role.
     * @param permissions - An array of permissions to be set for the role.
     * @returns A promise that resolves to the updated Role object.
     * @throws Throws a ProjectError if the role or any permission does not exist.
     */
    public async setPermissionsForRole(roleId: RoleId, permissions: Permission[]): Promise<Role> {
        await this.dbClient.db.tx(async transaction => {
            // Validate role existence
            await this.validateRoleExists(transaction, roleId);

            // Prepare permission IDs
            const permissionIds = permissions.map(p => p.id);

            // Validate permissions
            await this.validatePermissionsExist(transaction, permissionIds);

            // Insert new permissions (ignoring duplicates)
            const insertQueries = permissions.map(permission =>
                transaction.none('INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [roleId, permission.id])
            );
            await Promise.all(insertQueries);

            // Delete old permissions not in the new set
            const deleteQuery = `
            DELETE FROM role_permission
            WHERE role_id = $1 AND permission_id <> ALL($2::uuid[]);`;


            await transaction.none(deleteQuery, [roleId, permissionIds]);
        });

        return this.getRoleById(roleId);
    }


    /**
     * Validates the existence of a role with the given ID within a transaction.
     * Executes a query to check if the role exists in the database.
     *
     * @param transaction - The database transaction context.
     * @param roleId - The unique identifier of the role to validate.
     * @throws Throws a ProjectError with ROLE_NOT_FOUND code if the role does not exist.
     */
    private async validateRoleExists(transaction: any, roleId: RoleId): Promise<void> {
        const roleExists = await transaction.oneOrNone('SELECT uid FROM role WHERE uid = $1', [roleId]);
        if (!roleExists) {
            throw new ProjectError(`Role with ID ${roleId} does not exist`, ProjectErrorCode.ROLE_NOT_FOUND);
        }
    }


    /**
     * Validates that all provided permission IDs exist within a transaction.
     * Executes a query to identify any permission IDs that do not exist in the database.
     *
     * @param transaction - The database transaction context.
     * @param permissionIds - An array of permission IDs to validate.
     * @throws Throws a ProjectError with INVALID_PERMISSION code if any permission IDs are nonexistent.
     */
    private async validatePermissionsExist(transaction: any, permissionIds: string[]): Promise<void> {
        const nonexistentCheckQuery = `
        SELECT unnest($1::uuid[]) AS permission_id
        EXCEPT
        SELECT id FROM permission WHERE id = ANY($1::uuid[]);
    `;
        const nonexistentPermissions = await transaction.manyOrNone(nonexistentCheckQuery, [permissionIds]);
        if (nonexistentPermissions.length > 0) {
            throw new ProjectError('Nonexistent permissions found', ProjectErrorCode.INVALID_PERMISSION, { nonexistentPermissions });
        }
    }


    /**
     * Retrieves a role by its ID.
     * Executes a query to fetch a role and its associated permissions based on the role's ID.
     *
     * @param roleId - The unique identifier of the role to be retrieved.
     * @throws Throws a ProjectError with ROLE_NOT_FOUND code if the role does not exist.
     * @returns A Promise that resolves to the Role object if found.
     */

    public async getRoleById(roleId: RoleId): Promise<Role> {
        const query = `
        SELECT r.uid, r.name, p.id as permission_id, p.name as permission_name, p.effect, p.action, p.resource, p.description 
        FROM role r
        LEFT JOIN role_permission rp ON r.uid = rp.role_id
        LEFT JOIN permission p ON rp.permission_id = p.id
        WHERE r.uid = $1;
    `;
        const roleData = await this.dbClient.db.query(query, [roleId]);

        // If no role is found, roleData will be empty
        if (roleData.length === 0) {
            throw new ProjectError(`Role with ID ${roleId} does not exist`, ProjectErrorCode.ROLE_NOT_FOUND);
        }
        // Since it's a single role, we can directly transform and return the first element
        const transformedRoles = this.transformToRoleObjects(roleData);
        return transformedRoles[0];
    }

}
