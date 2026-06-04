import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { Player } from '../../domain/entities/player.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { PeladaNotFoundError } from '../../domain/errors';

interface GetPlayersInput {
  peladaId: string;
}

type GetPlayersOutput = Result<Player[], AppError>;

@Injectable()
export class GetPlayersByPelada {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: GetPlayersInput): Promise<GetPlayersOutput> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    const players = await this.peladaRepository.findManyPlayersByPeladaId(
      input.peladaId,
    );

    return Result.ok(players);
  }
}
