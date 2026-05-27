import {
  PeladaPermission,
  type PlayerPrivilege,
} from '../entities/pelada-permission.entity';
import { Pelada } from '../entities/pelada.entity';
import { Player } from '../entities/player.entity';

export abstract class PeladaRepository {
  abstract create(pelada: Pelada): Promise<void>;
  abstract findById(id: string): Promise<Pelada | null>;
  abstract findManyByUserId(userId: string): Promise<Pelada[]>;
  abstract addPlayer(player: Player): Promise<void>;
  abstract findManyPlayersByPeladaId(peladaId: string): Promise<Player[]>;
  abstract findPermission(
    premission: PeladaPermission,
  ): Promise<PeladaPermission | null>;
  abstract assignPermissions(permissions: PeladaPermission[]): Promise<void>;
  abstract revokePermissions(
    userId: string,
    peladaId: string,
    privileges: PlayerPrivilege[],
  ): Promise<void>;
}
