import { Request, Response } from 'express';
import {IRoleService} from "../services/IRoleService";
import {ProjectError, ProjectErrorCode} from "../models/ProjectError";
import {permissionSchemaForValidation} from "../models/permission";
import Joi from "joi";
import {roleLengthConstraint} from "../models/role";
import {InstanceProviderviaDI} from "../di_containers/InstanceProviderviaDI";

export class RoleServiceController {


    static async getRoles(req: Request, res: Response) {
        try {

            //consider it as service locator pattren
            const roles = await  InstanceProviderviaDI.getContainer().get<IRoleService>('IRoleService').getRoles();
            res.json(roles);
        } catch (error) {
            console.error(error); // logging the error for debugging purposes we can centralized it too.
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    static async getPermissions(req: Request, res: Response) {
        try {
            const permissions =await InstanceProviderviaDI.getContainer().get<IRoleService>('IRoleService').getPermissions();
            res.json(permissions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async setPermissionForARole(req: Request, res: Response) {
        try {

            // Extract data from request
            const { roleId, permissions } = req.body;

            // Validate roleId
            const roleValidationResult = roleLengthConstraint.validate(roleId);
            if (roleValidationResult.error) {
                return res.status(400).json({ error: roleValidationResult.error.details[0].message, code: ProjectErrorCode.INVALID_INPUT });
            }

            // Validate permissions array
            const permissionsValidationSchema = Joi.array().items(permissionSchemaForValidation).required();
            const permissionsValidationResult = permissionsValidationSchema.validate(permissions);
            if (permissionsValidationResult.error) {
                return res.status(400).json({ error: permissionsValidationResult.error.details[0].message ,code: ProjectErrorCode.INVALID_INPUT});
            }

            // Call the service method with validated data
            const updatedRole = await InstanceProviderviaDI.getContainer().get<IRoleService>('IRoleService').setPermissionsForRole(roleId, permissions);
            res.json(updatedRole);

        } catch (error) {
            if (error instanceof ProjectError) {
                // Handle custom ProjectError
                switch (error.errorCode) {
                    case ProjectErrorCode.ROLE_NOT_FOUND:
                        res.status(404).json({ error: error.message, code: error.errorCode });
                        break;
                    case ProjectErrorCode.INVALID_PERMISSION:
                        res.status(400).json({ error: error.message, code: error.errorCode, data:error.errorData});
                        break;

                    //rest of the errors are not thrown by me so I will consider them as server error
                    default:
                        console.error(error); // Consider logging the error for debugging purposes
                        res.status(500).json({ error: 'Internal Server Error' });
                        break;
                }
            } else {
                console.error(error); // Consider logging the error for debugging purposes
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

}

