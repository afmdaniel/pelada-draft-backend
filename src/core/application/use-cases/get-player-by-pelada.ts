import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';

interface GetPlayersInput {
  peladaId: string;
}

@Injectable()
export class GetPlayersByPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPlayersInput): Promise<Player[]> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      throw new Error('Pelada não encontrada.');
    }

    return this.peladaRepository.findManyPlayersByPeladaId(input.peladaId);
  }
}
