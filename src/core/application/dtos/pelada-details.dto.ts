import { PeladaPrivilege } from '../../domain/entities/pelada-permission.entity';

export type PeladaDetails = {
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  privileges: PeladaPrivilege[];
  players: Array<{
    id: string;
    name: string;
    stars: number;
    position: string;
  }>;
};
