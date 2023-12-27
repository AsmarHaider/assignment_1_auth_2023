
import { Role, RoleId } from '../models/role';
import { Permission } from '../models/permission';

/**
 * Interface for the repository handling roles and permissions.
 */
export interface IRoleRepository {

    /**
     * Retrieves all roles available in the system.
     * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
     * @throws {ProjectError} Throws 'QUERY_ERROR' if there is an issue with the query execution.
     * @throws {Error} Throws 'Error' for unknown errors
     */
    getRoles(): Promise<Role[]>;

    /**
     * Fetches all available permissions in the system.
     * @returns {Promise<Permission[]>} A promise that resolves to an array of PermissionEntity objects.
     * @throws {ProjectError} Throws 'QUERY_ERROR' if there is an issue with the query execution.
     * @throws {Error} Throws 'Error' for unknown errors
     */
    getPermissions(): Promise<Permission[]>;

    /**
     * Sets or updates the permissions for a specified role.
     * *
     * @param roleId - The unique identifier of the role for which permissions are being set or updated.
     * @param permissions - An array of permissions to be set for the role. Each permission should match
     *                        the structure and content of permissions in the system.
     * @returns A promise that resolves to the updated Role object with the new set of permissions.
     * @throws {ProjectError} - Throws a ProjectError with ProjectErrorCode.ROLE_NOT_FOUND if the role is not found.
     *  *                          Throws a ProjectError with ProjectErrorCode.PERMISSION_NOT_FOUND if any provided
     *  *                          permission is invalid or not found in the system. QUERY_ERROR for queries error related
     *                             to db CONVERSION_ERROR_ACTION_ARRAY_TO_OBJECT for conversions errors
     * @throws {Error} Throws 'Error' for unknown errors
     *
     *  */
    setPermissionsForRole(roleId: RoleId, permissions: Permission[]): Promise<Role>;

}
