import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { Player } from '../entities/player.entity';
import { PlayerPosition } from '../constants/player-position';

interface UpdatePlayerInput {
  peladaId: string;
  playerId: string;
  name: string;
  stars: number;
  position?: PlayerPosition;
}

@Injectable()
export class UpdatePlayer {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: UpdatePlayerInput): Promise<Player> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player) throw new NotFoundException('Jogador não encontrado.');

    if (player.peladaId !== input.peladaId)
      throw new BadRequestException('Esse jogador não pertence a essa pelada.');

    const newPlayer = new Player({
      id: input.playerId,
      stars: input.stars,
      name: input.name,
      position: input.position,
      peladaId: player.peladaId,
    });

    await this.peladaRepository.updatePlayer(newPlayer);

    return newPlayer;
  }
}
