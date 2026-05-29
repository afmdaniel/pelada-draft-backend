import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';

interface DeletePlayerInput {
  playerId: string;
  peladaId: string;
}

@Injectable()
export class DeletePlayer {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: DeletePlayerInput): Promise<void> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player) {
      throw new NotFoundException('Jogador não encontrado.');
    }

    if (player.peladaId !== input.peladaId)
      throw new BadRequestException('Esse jogador não pertence a essa pelada.');

    await this.peladaRepository.deletePlayer(player.id!);
  }
}
