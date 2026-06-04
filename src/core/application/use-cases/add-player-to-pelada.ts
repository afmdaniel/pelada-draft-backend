import { Injectable } from '@nestjs/common';
import { Player } from '../../domain/entities/player.entity';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { PlayerPosition } from '../../domain/constants/player-position';
import { AppError } from '../../domain/errors/app-error';
import { Result } from '../../domain/logic/result';
import {
  PeladaNotFoundError,
  PlayerAlreadyExistsError,
} from '../../domain/errors';

interface AddPlayerInput {
  name: string;
  stars: number;
  position?: PlayerPosition;
  peladaId: string;
}

type AddPlayerOutput = Result<Player, AppError>;

@Injectable()
export class AddPlayerToPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: AddPlayerInput): Promise<AddPlayerOutput> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    const playerAlreadyExists =
      await this.peladaRepository.findPlayerByNameAndPeladaId(
        input.name,
        input.peladaId,
      );

    if (playerAlreadyExists) {
      return Result.fail(new PlayerAlreadyExistsError());
    }

    const playerOrError = Player.create({
      name: input.name,
      stars: input.stars,
      position: input.position,
      peladaId: input.peladaId,
    });

    if (playerOrError.isFailure) {
      return Result.fail(playerOrError.error);
    }

    const player = playerOrError.value;

    await this.peladaRepository.addPlayer(player);

    return Result.ok(player);
  }
}
