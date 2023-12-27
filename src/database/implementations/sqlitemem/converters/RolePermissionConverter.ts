import {RoleEntity} from "../entities/RoleEntity";
import {Role} from "../../../../models/role";
import {PermissionEntity} from "../entities/PermissionEntity";
import {AuthenticationAction, DatabaseAction, Permission} from "../../../../models/permission";
import {ProjectError, ProjectErrorCode} from "../../../../models/ProjectError";
import {RolePermissionEntity} from "../entities/RolePermissionEntity";

export class RolePermissionConverter {


    /**
     * Converts a RoleEntity to a Role object.
     * Maps the roleEntity and its associated permissions to a Role object.
     *
     * @param roleEntity - The RoleEntity instance to be converted.
     * @returns A Role object with id, name, and permissions properties.
     */
    static toRole(roleEntity: RoleEntity): Role {
        return {
            id: roleEntity.id,
            name: roleEntity.name,
            permissions: roleEntity.rolePermissionsEntities.map(rp => this.toPermission(rp.permissionEntity))
        };
    }

    /**
     * Converts a PermissionEntity to a Permission object.
     * Transforms the attributes of PermissionEntity into the format of a Permission object.
     *
     * @param permissionEntity - The PermissionEntity instance to be converted.
     * @returns A Permission object with corresponding fields from the PermissionEntity.
     */
    static toPermission(permissionEntity: PermissionEntity): Permission {
        return {
            id: permissionEntity.id,
            name: permissionEntity.name,
            effect: permissionEntity.effect as 'Allow' | 'Deny',
            action: this.getPermissionActionObj(permissionEntity.action),
            resource: permissionEntity.resource,
            description: permissionEntity.description?permissionEntity.description:undefined
        };
    }

    /**
     * Converts a Role object to a RoleEntity.
     * Creates a new RoleEntity instance and maps the Role object's properties to it.
     *
     * @param role - The Role object to be converted.
     * @returns A RoleEntity instance with properties populated from the Role object.
     */
    static fromRole(role: Role): RoleEntity {
        const roleEntity = new RoleEntity();
        roleEntity.id = role.id;
        roleEntity.name = role.name;
        roleEntity.rolePermissionsEntities = role.permissions.map(this.fromPermissionToRolePermission);
        return roleEntity;
    }


    /**
     * Converts a Permission object to a PermissionEntity.
     * Generates a new PermissionEntity and populates it with the data from the Permission object.
     *
     * @param permission - The Permission object to be converted.
     * @returns A PermissionEntity instance with values derived from the Permission object.
     */
    static fromPermission(permission: Permission): PermissionEntity {

        const permissionEntity = new PermissionEntity();
        permissionEntity.id = permission.id;
        permissionEntity.name = permission.name;
        permissionEntity.effect = permission.effect;
        permissionEntity.action = permission.action.map(a => a.toString()).join(",")
        permissionEntity.resource = permission.resource;
        permissionEntity.description = permission.description?permission.description:null;
        return permissionEntity;
    }


    /**
     * Converts a Permission object to a RolePermissionEntity.
     * Used for mapping a Permission to a RolePermissionEntity in the context of a Role.
     *
     * @param permission - The Permission object to be converted.
     * @returns A RolePermissionEntity instance linked to the given Permission.
     */
    private static fromPermissionToRolePermission(permission: Permission): RolePermissionEntity {
        const rolePermissionEntity = new RolePermissionEntity();
        rolePermissionEntity.permissionEntity = this.fromPermission(permission);
        return rolePermissionEntity;
    }


    /**
     * Converts a comma-separated string of actions into an array of DatabaseAction or AuthenticationAction.
     * Throws an error if the actions string does not correspond to known action types.
     *
     * @param actionsString - The string containing action names separated by commas.
     * @throws Throws a ProjectError if the action string cannot be converted.
     * @returns An array of DatabaseAction or AuthenticationAction.
     */
    private static getPermissionActionObj(actionsString: string): DatabaseAction[] | AuthenticationAction[] {
        const actions= actionsString.split(",");
        const firstAction = actions[0];
        if (Object.values(DatabaseAction).includes(firstAction as DatabaseAction)) {
            return actions as DatabaseAction[];
        } else if (Object.values(AuthenticationAction).includes(firstAction as AuthenticationAction)) {
            return actions as AuthenticationAction[];
        } else {
            throw new ProjectError("Error Converting database string array to object:action "+actions, ProjectErrorCode.CONVERSION_ERROR_ACTION_ARRAY_TO_OBJECT);
        }
    }
}
