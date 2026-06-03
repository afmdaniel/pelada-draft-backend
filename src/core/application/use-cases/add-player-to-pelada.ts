import { Injectable } from '@nestjs/common';
import { Player } from '../../domain/entities/player.entity';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { PlayerPosition } from '../../domain/constants/player-position';

interface AddPlayerInput {
  name: string;
  stars: number;
  position?: PlayerPosition;
  peladaId: string;
}

@Injectable()
export class AddPlayerToPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: AddPlayerInput): Promise<Player> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      throw new Error('Pelada não encontrada.');
    }

    const player = new Player({
      name: input.name,
      stars: input.stars,
      position: input.position,
      peladaId: input.peladaId,
    });

    await this.peladaRepository.addPlayer(player);

    return player;
  }
}
