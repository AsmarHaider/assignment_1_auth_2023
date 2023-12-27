import { Role, RoleId } from '../models/role';
import { Permission } from '../models/permission';

/**
 * Interface for a service managing roles and permissions.
 */
export interface IRoleService {
    /**
     * Retrieves all available roles from the system.
     *
     * @returns A Promise resolving to an array of Role objects.
     */
    getRoles(): Promise<Role[]>;

    /**
     * Fetches all defined permissions from the system.
     *
     * @returns A Promise resolving to an array of Permission objects.
     */
    getPermissions(): Promise<Permission[]>;

    /**
     * Sets the permissions for a specific role.
     *
     * @param roleId - The unique identifier of the role to be updated.
     * @param permissions - An array of permissions to be assigned to the role.
     * @returns A Promise resolving to the updated Role object.
     * @throws Throws a ProjectError if the role or any permission does not exist.
     *         May throw other errors related to query execution or data conversion.
     */
    setPermissionsForRole(roleId: RoleId, permissions: Permission[]): Promise<Role>;
}


