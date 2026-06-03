import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { DrawBalancerService } from '../../domain/services/draw-balancer.service';
import { Team } from '../../domain/entities/team.entity';
import { DrawContext } from '../../domain/value-objects/draw-context';

interface DrawTeamsInput {
  peladaId: string;
  playersIds: string[];
  teamsQuantity: number;
  withPosition: boolean;
}

@Injectable()
export class DrawTeams {
  constructor(
    private peladaRepository: PeladaRepository,
    private drawBalancerService: DrawBalancerService,
  ) {}

  async execute(input: DrawTeamsInput): Promise<Team[]> {
    const allPlayers = await this.peladaRepository.findManyPlayersByPeladaId(
      input.peladaId,
    );

    const selectedPlayers = allPlayers.filter((player) =>
      input.playersIds.includes(player.id!),
    );

    if (selectedPlayers.length !== input.playersIds.length) {
      throw new Error(
        'Um ou mais jogadores selecionados não pertencem a esta pelada.',
      );
    }

    return this.drawBalancerService.draw(
      new DrawContext(
        input.peladaId,
        selectedPlayers,
        input.teamsQuantity,
        input.withPosition,
      ),
    );
  }
}
