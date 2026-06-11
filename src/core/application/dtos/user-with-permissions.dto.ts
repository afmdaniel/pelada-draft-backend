import { PeladaPrivilege } from '../../domain/entities/pelada-permission.entity';

export type UserWithPermissions = {
  username: string;
  email: string;
  privileges: PeladaPrivilege[];
};
