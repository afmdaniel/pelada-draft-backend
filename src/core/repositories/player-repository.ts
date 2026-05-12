import { Player } from '../entities/player.entity';

export abstract class PlayerRepository {
  abstract create(player: Player): Promise<void>;
  abstract findManyByGroup(groupId: string): Promise<Player[]>;
  abstract update(player: Player): Promise<void>;
  abstract delete(playerId: string): Promise<void>;
}
