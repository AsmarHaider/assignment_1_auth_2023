
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PermissionEntity } from './PermissionEntity';
import {RoleEntity} from "./RoleEntity";


/**
 * Entity representing the association between roles and permissions.
 * This entity is used to map roles to their corresponding permissions in the database.
 * It contains two primary keys, `roleId` and `permissionId`, indicating a composite key.
 */
@Entity()
export class RolePermissionEntity {
    @PrimaryColumn()
    roleId!: string;

    @PrimaryColumn()
    permissionId!: string;

    /**
     * Many-to-one relationship to the RoleEntity.
     * This establishes a connection between each RolePermissionEntity and a RoleEntity,
     * identified by `roleId`.
     */
    @ManyToOne(() => RoleEntity, roleEntity => roleEntity.rolePermissionsEntities)
    @JoinColumn({ name: 'roleId' })
    roleEntity!: RoleEntity;

    /**
     * Many-to-one relationship to the PermissionEntity.
     * This sets up a link between each RolePermissionEntity and a PermissionEntity,
     * identified by `permissionId`.
     */
    @ManyToOne(() => PermissionEntity, permissionEntity => permissionEntity.rolePermissionEntities)
    @JoinColumn({ name: 'permissionId' })
    permissionEntity!: PermissionEntity;
}


