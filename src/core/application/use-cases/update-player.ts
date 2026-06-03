import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';
import { PlayerPosition } from '../../domain/constants/player-position';

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

    const playerAlreadyExists =
      await this.peladaRepository.findPlayerByNameAndPeladaId(
        input.name,
        input.peladaId,
      );

    if (playerAlreadyExists?.id !== input.playerId && playerAlreadyExists) {
      throw new ConflictException(
        'Já existe um jogador cadastrado com este nome nesta pelada.',
      );
    }

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
