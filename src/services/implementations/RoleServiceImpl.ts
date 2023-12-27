import {IRoleService} from "../IRoleService";
import {Role, RoleId} from "../../models/role";
import {IRoleRepository} from "../../repositories/IRoleRepository";
import {inject, injectable} from "inversify";
import {Permission} from "../../models/permission";

@injectable()
export class RoleServiceImpl implements IRoleService{

    private repository: IRoleRepository;



    constructor(@inject("IRoleRepository") repository:IRoleRepository) {
        this.repository = repository;
    }
    public async  getRoles(): Promise<Role[]>{
        //here we can also check the cache, like memcached or redis
        //for simplicity I have not implemented it
         return this.repository.getRoles();
    }

   public async getPermissions(): Promise<Permission[]>{
       //here we can also check the cache, like memcached or redis
       //for simplicity I have not implemented it
        return this.repository.getPermissions();

    }


    public  async setPermissionsForRole(roleId: RoleId, permissions: Permission[]): Promise<Role>{
         return this.repository.setPermissionsForRole(roleId,permissions);
    }


}