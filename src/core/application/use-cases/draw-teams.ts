import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { DrawBalancerService } from '../../domain/services/draw-balancer.service';
import { Team } from '../../domain/entities/team.entity';
import { DrawContext } from '../../domain/value-objects/draw-context';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  InvalidTeamCountError,
  PeladaNotFoundError,
  PlayersNotInPeladaError,
} from '../../domain/errors';

interface DrawTeamsInput {
  peladaId: string;
  playersIds: string[];
  teamsQuantity: number;
  withPosition: boolean;
}

type DrawTeamsOutput = Result<Team[], AppError>;

@Injectable()
export class DrawTeams {
  constructor(
    private peladaRepository: PeladaRepository,
    private drawBalancerService: DrawBalancerService,
  ) {}

  async execute(input: DrawTeamsInput): Promise<DrawTeamsOutput> {
    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    if (input.teamsQuantity < 2) {
      return Result.fail(new InvalidTeamCountError());
    }

    const allPlayers = await this.peladaRepository.findManyPlayersByPeladaId(
      input.peladaId,
    );

    const selectedPlayers = allPlayers.filter((player) =>
      input.playersIds.includes(player.id!),
    );

    if (selectedPlayers.length !== input.playersIds.length) {
      return Result.fail(new PlayersNotInPeladaError());
    }

    const context = new DrawContext(
      input.peladaId,
      selectedPlayers,
      input.teamsQuantity,
      input.withPosition,
    );

    const teams = this.drawBalancerService.draw(context);

    return Result.ok(teams);
  }
}
