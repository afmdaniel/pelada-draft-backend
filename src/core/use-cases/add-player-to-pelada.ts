// import { Injectable } from '@nestjs/common';
import { Player } from '../entities/player.entity';
import { PeladaRepository } from '../repositories/pelada-repository';

interface AddPlayerInput {
  name: string;
  stars: number;
  position?: 'Zaga' | 'Meio' | 'Ataque' | 'Geral';
  peladaId: string;
}

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
