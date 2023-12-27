import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {RolePermissionEntity} from "./RolePermissionEntity";

@Entity()
export class RoleEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    name!: string;

    @OneToMany(() => RolePermissionEntity, rolePermissionEntity => rolePermissionEntity.roleEntity)
    rolePermissionsEntities!: RolePermissionEntity[];
}

