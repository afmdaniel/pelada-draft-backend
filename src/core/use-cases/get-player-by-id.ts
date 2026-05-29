import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { Player } from '../entities/player.entity';

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
