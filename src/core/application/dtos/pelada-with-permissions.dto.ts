import { PeladaPrivilege } from '../../domain/entities/pelada-permission.entity';

export type PeladaWithPermissions = {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  privileges: PeladaPrivilege[];
};
