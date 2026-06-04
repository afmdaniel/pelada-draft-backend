import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';
import { PlayerPosition } from '../../domain/constants/player-position';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  PlayerAlreadyExistsError,
  PlayerNotFoundError,
} from '../../domain/errors';

interface UpdatePlayerInput {
  peladaId: string;
  playerId: string;
  name: string;
  stars: number;
  position?: PlayerPosition;
}

type UpdatePlayerOutput = Result<Player, AppError>;

@Injectable()
export class UpdatePlayer {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: UpdatePlayerInput): Promise<UpdatePlayerOutput> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player || player.peladaId !== input.peladaId) {
      return Result.fail(new PlayerNotFoundError());
    }

    const playerAlreadyExists =
      await this.peladaRepository.findPlayerByNameAndPeladaId(
        input.name,
        input.peladaId,
      );

    if (playerAlreadyExists?.id !== input.playerId && playerAlreadyExists) {
      return Result.fail(new PlayerAlreadyExistsError());
    }

    const newPlayerOrError = Player.create({
      id: input.playerId,
      stars: input.stars,
      name: input.name,
      position: input.position,
      peladaId: player.peladaId,
    });

    if (newPlayerOrError.isFailure) {
      return Result.fail(newPlayerOrError.error);
    }

    const newPlayer = newPlayerOrError.value;
    await this.peladaRepository.updatePlayer(newPlayer);

    return Result.ok(newPlayer);
  }
}
