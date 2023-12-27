import {inject, injectable} from "inversify";
import {IRoleRepository} from "../IRoleRepository";
import {IDbClient} from "../../database/IDbClient";
import {DataSource, EntityManager, Repository} from "typeorm";
import {RoleEntity} from "../../database/implementations/sqlitemem/entities/RoleEntity";
import {PermissionEntity} from "../../database/implementations/sqlitemem/entities/PermissionEntity";
import {Role} from "../../models/role";
import {RolePermissionConverter} from "../../database/implementations/sqlitemem/converters/RolePermissionConverter";
import {Permission} from "../../models/permission";
import {RolePermissionEntity} from "../../database/implementations/sqlitemem/entities/RolePermissionEntity";
import {ProjectError, ProjectErrorCode} from "../../models/ProjectError";


@injectable()
export class SQLiteRoleRepositoryImpl implements IRoleRepository {

    private dbClient: IDbClient<DataSource>;
    private roleRepository: Repository<RoleEntity>;
    private permissionRepository: Repository<PermissionEntity>;

    /**
     * Constructs an instance of SQLiteRoleRepositoryImpl.
     * Initializes the role and permission repositories using the provided database client.
     *
     * @param dbClient - The database client used for database operations, injected via dependency injection.
     */
    constructor(@inject("IDbClient") dbClient: IDbClient<DataSource>) {
        this.dbClient = dbClient;
        this.roleRepository = dbClient.db.getRepository(RoleEntity);
        this.permissionRepository = dbClient.db.getRepository(PermissionEntity);

    }

    /**
     * Retrieves all roles from the database.
     * Each role includes its related permissions.
     *
     * @returns A Promise that resolves to an array of Role objects.
     */

    public async getRoles(): Promise<Role[]> {
        const roles = await this.roleRepository.find({
            relations: ['rolePermissionsEntities', 'rolePermissionsEntities.permissionEntity']
        });

        return roles.map(roleEntity => RolePermissionConverter.toRole(roleEntity));
    }


    /**
     * Fetches all permissions from the database.
     *
     * @returns A Promise that resolves to an array of Permission objects.
     */
    public async getPermissions(): Promise<Permission[]> {
        const permissions = await this.permissionRepository.find();
        return permissions.map(permissionEntity => RolePermissionConverter.toPermission(permissionEntity));
    }



    /**
     * Sets permissions for a specified role.
     * Includes transactional integrity for updating role permissions.
     *
     * @param roleId - The unique identifier of the role.
     * @param permissions - An array of permissions to be associated with the role. (I would argue to pass only ids but assignment has permission object)
     * @returns A Promise that resolves to the updated Role object.
     */
    public async setPermissionsForRole(roleId: string, permissions: Permission[]): Promise<Role> {
        return this.dbClient.db.transaction(async (transactionalEntityManager: EntityManager) => {
            const roleEntity = await this.checkRoleExistence(transactionalEntityManager, roleId);
            const permissionIds = permissions.map(p => p.id);
            await this.validatePermissionIds(transactionalEntityManager, permissionIds);
            await this.removeExistingPermissions(transactionalEntityManager, roleId);
            const newRolePermissions = await this.createNewRolePermissions(permissions, roleEntity);
            return this.updateAndRetrieveRole(transactionalEntityManager, roleId, newRolePermissions);
        });
    }


    /**
     * Checks if a role exists in the database within a transaction.
     *
     * @param transactionalEntityManager - The EntityManager within the transaction.
     * @param roleId - The unique identifier of the role to check.
     * @throws Throws ProjectError if the role does not exist.
     * @returns A Promise resolving to the found RoleEntity.
     */
    // Function to check role existence
   private async checkRoleExistence(transactionalEntityManager: EntityManager, roleId: string): Promise<RoleEntity> {
        const roleEntity = await transactionalEntityManager.findOne(RoleEntity, {
            where: { id: roleId },
            relations: ['rolePermissionsEntities', 'rolePermissionsEntities.permissionEntity']
        });

        if (!roleEntity) {
            throw new ProjectError(`Role with ID ${roleId} does not exist`,ProjectErrorCode.ROLE_NOT_FOUND);
        }
        return roleEntity;
    }


    /**
     * Validates the existence of given permission IDs within a transaction.
     *
     * @param transactionalEntityManager - The EntityManager within the transaction.
     * @param permissionIds - Array of permission IDs to validate.
     * @throws Throws ProjectError if any permission ID is invalid.
     */
    private async validatePermissionIds(transactionalEntityManager: EntityManager, permissionIds: string[]): Promise<void> {
        const foundPermissions = await transactionalEntityManager
            .createQueryBuilder(PermissionEntity, 'permission')
            .where('permission.id IN (:...ids)', { ids: permissionIds })
            .getMany();

        if (foundPermissions.length !== permissionIds.length) {
            const validIds = new Set(foundPermissions.map(p => p.id));
            const invalidIds = permissionIds.filter(id => !validIds.has(id));

            throw new ProjectError(`Invalid permission IDs: ${invalidIds.join(', ')}`, ProjectErrorCode.INVALID_PERMISSION);
        }
    }


    /**
     * Removes existing permissions of a role within a transaction.
     *
     * @param transactionalEntityManager - The EntityManager within the transaction.
     * @param roleId - The unique identifier of the role whose permissions are to be removed.
     */

   private async  removeExistingPermissions(transactionalEntityManager: EntityManager, roleId: string): Promise<void> {
        await transactionalEntityManager.createQueryBuilder()
            .delete()
            .from(RolePermissionEntity)
            .where("roleId = :roleId", { roleId })
            .execute();
    }


    /**
     * Creates new RolePermissionEntity instances for a given set of permissions and a role.
     *
     * @param permissions - Array of Permission objects to associate with the role.
     * @param roleEntity - The RoleEntity to which permissions are to be associated.
     * @returns An array of RolePermissionEntity instances.
     */
    private async createNewRolePermissions(permissions: Permission[], roleEntity: RoleEntity): Promise<RolePermissionEntity[]> {
        return permissions.map(permission => {
            const permissionEntity = RolePermissionConverter.fromPermission(permission);
            const rolePermissionEntity = new RolePermissionEntity();
            rolePermissionEntity.roleEntity = roleEntity;
            rolePermissionEntity.permissionEntity = permissionEntity;
            return rolePermissionEntity;
        });
    }

    /**
     * Updates role permissions in the database and retrieves the updated role within a transaction.
     *
     * @param transactionalEntityManager - The EntityManager within the transaction.
     * @param roleId - The unique identifier of the role being updated.
     * @param newRolePermissions - An array of RolePermissionEntity to be associated with the role.
     * @throws Throws ProjectError if the role does not exist.
     * @returns A Promise that resolves to the updated Role object.
     */
   private async  updateAndRetrieveRole(transactionalEntityManager: EntityManager, roleId: string, newRolePermissions: RolePermissionEntity[]): Promise<Role> {
        await transactionalEntityManager.save(newRolePermissions);
        const updatedRoleEntity = await transactionalEntityManager.findOne(RoleEntity, {
            where: { id: roleId },
            relations: ['rolePermissionsEntities', 'rolePermissionsEntities.permissionEntity']
        });

        if(updatedRoleEntity)
          return RolePermissionConverter.toRole(updatedRoleEntity);
        else
            throw new ProjectError(`Role with ID ${roleId} does not exist, Server error`,ProjectErrorCode.SERVER_ERROR);
    }





}
