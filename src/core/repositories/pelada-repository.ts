import { PeladaDetails } from '../dtos/pelada-details.dto';
import { PeladaWithPermissions } from '../dtos/pelada-with-permissions.dto';
import {
  PeladaPermission,
  type PeladaPrivilege,
} from '../entities/pelada-permission.entity';
import { Pelada } from '../entities/pelada.entity';
import { Player } from '../entities/player.entity';

export abstract class PeladaRepository {
  abstract create(pelada: Pelada): Promise<void>;
  abstract update(pelada: Pelada): Promise<void>;
  abstract delete(peladaId: string): Promise<void>;
  abstract findById(id: string): Promise<Pelada | null>;
  abstract findDetailsById(
    peladaId: string,
    currentUserId: string,
  ): Promise<PeladaDetails | null>;
  abstract findManyByUserId(
    userId: string,
    userRole: string,
  ): Promise<PeladaWithPermissions[]>;
  abstract addPlayer(player: Player): Promise<void>;
  abstract findPlayerById(playerId: string): Promise<Player | null>;
  abstract updatePlayer(player: Player): Promise<void>;
  abstract deletePlayer(playerId: string): Promise<void>;
  abstract findManyPlayersByPeladaId(peladaId: string): Promise<Player[]>;
  abstract findPermission(
    premission: PeladaPermission,
  ): Promise<PeladaPermission | null>;
  abstract assignPermissions(permissions: PeladaPermission[]): Promise<void>;
  abstract revokePermissions(
    userId: string,
    peladaId: string,
    privileges: PeladaPrivilege[],
  ): Promise<void>;
}
