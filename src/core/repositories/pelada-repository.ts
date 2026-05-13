import { Pelada } from '../entities/pelada.entity';
import { Player } from '../entities/player.entity';

export abstract class PeladaRepository {
  abstract create(pelada: Pelada): Promise<void>;
  abstract findById(id: string): Promise<Pelada | null>;
  abstract addPlayer(player: Player): Promise<void>;
  abstract findManyPlayersByPeladaId(peladaId: string): Promise<Player[]>;
}
