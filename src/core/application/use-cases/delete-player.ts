import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { PlayerNotFoundError } from '../../domain/errors';

interface DeletePlayerInput {
  playerId: string;
  peladaId: string;
}

type DeletePlayerOutput = Result<void, AppError>;

@Injectable()
export class DeletePlayer {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: DeletePlayerInput): Promise<DeletePlayerOutput> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player || player.peladaId !== input.peladaId) {
      return Result.fail(new PlayerNotFoundError());
    }

    await this.peladaRepository.deletePlayer(player.id!);

    return Result.ok<void>(undefined);
  }
}
