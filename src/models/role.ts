import {Permission, permissionSchemaForValidation} from './permission';
import Joi from "joi";


export type RoleId = string;

/**
 * Defines the structure for a Role.
 *
 * @property {RoleId} id - The unique identifier for the role, following UUID format.
 * @property {string} name - The name of the role.
 * @property {Permission[]} permissions - A list of permissions associated with the role.
 */
export type Role = {
    id: RoleId; // UUID identifier
    name: string;
    permissions: Permission[];
};

/**
 * Joi validation schema for Permission objects.
 * This schema is used to validate the structure and data types of Permission objects,
 * ensuring they conform to expected standards.
 *
 * */
export const roleSchemaForValidation = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    permissions: Joi.array().items(permissionSchemaForValidation).required()
});

export const roleLengthConstraint = Joi.string().uuid().required();