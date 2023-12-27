/**
 *
 * Enumeration of standard actions for database permissions.
 */

import Joi from 'joi';
export enum DatabaseAction {
    READ = "db:read",
    WRITE = "db:write",
    UPDATE = "db:update",
    DELETE = "db:delete",
}

export enum AuthenticationAction {
    VERIFY = "ath:verify",
    CHANGE_PASSWORD = "ath:change_password",
    RESET_PASSWORD = "ath:update_password",
    CREATE_USER = "ath:create_user",
}


/**
 * Represents a UUID string identifier for a PermissionEntity.
 */
export type PermissionId = string;

/**
 * Defines the structure for a Database PermissionEntity.
 *
 * @property {PermissionId} id - The unique identifier for the permission, following UUID format.
 * @property {string} name - The name of the permission.
 * @property {'Allow' | 'Deny'} effect - The effect of the permission, either 'Allow' or 'Deny'.
 * @property {DatabaseAction[] | AuthenticationAction[]} action - The specific actions allowed by this permission.
 * @property {string} resource - The target resource for this permission, typically a database or table name.
 * @property {string} [description] - An optional description of what this permission entails.
 */
export type Permission = {
    id: PermissionId;
    name: string;
    effect: 'Allow' | 'Deny';
    action: DatabaseAction[] | AuthenticationAction[];
    resource: string;
    description?: string;
};

/**
 * Joi validation schema for Permission objects.
 * This schema is used to validate the structure and data types of Permission objects,
 * ensuring they conform to expected standards.
 *
 * */

// Combine the enum values into a single array for validation
const combinedActions = [
    ...Object.values(DatabaseAction),
    ...Object.values(AuthenticationAction)
];
export const permissionSchemaForValidation = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    effect: Joi.string().valid('Allow', 'Deny').required(),
    action: Joi.array().items(Joi.string().valid(...combinedActions)).required(),
    resource: Joi.string().required(),
    description: Joi.string().optional()
});