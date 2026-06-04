import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { PlayerNotFoundError } from '../../domain/errors';

interface GetPlayersByIdInput {
  playerId: string;
}

type GetPlayersByIdOutput = Result<Player, AppError>;

@Injectable()
export class GetPlayersByPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPlayersByIdInput): Promise<GetPlayersByIdOutput> {
    const player = await this.peladaRepository.findPlayerById(input.playerId);

    if (!player) {
      return Result.fail(new PlayerNotFoundError());
    }

    return Result.ok(player);
  }
}
