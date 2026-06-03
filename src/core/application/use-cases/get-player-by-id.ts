import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';

interface GetPlayersByIdInput {
  playerId: string;
}

@Injectable()
export class GetPlayersByPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPlayersByIdInput): Promise<Player> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player) {
      throw new Error('Jogador não encontrado.');
    }

    return player;
  }
}
