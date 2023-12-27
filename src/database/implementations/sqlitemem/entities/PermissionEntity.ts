import {Entity, Column, OneToMany, PrimaryColumn} from 'typeorm';
import { RolePermissionEntity } from './RolePermissionEntity';

@Entity()
export class PermissionEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    name!: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    effect!: 'Allow' | 'Deny';

    @Column('text')
    action!: string;

    @Column()
    resource!: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description!: string | null;

    @OneToMany(() => RolePermissionEntity, rolePermissionEntity => rolePermissionEntity.permissionEntity)
    rolePermissionEntities!: RolePermissionEntity[];
}
