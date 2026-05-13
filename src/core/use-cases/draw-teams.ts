import { Injectable } from '@nestjs/common';
import { Player } from '../entities/player.entity';
import { PeladaRepository } from '../repositories/pelada-repository';
import { DrawBalancerService } from '../services/draw-balancer.service';

interface DrawTeamsInput {
  peladaId: string;
  playersIds: string[];
  teamsQuantity: number;
}

@Injectable()
export class DrawTeams {
  constructor(private peladaRepository: PeladaRepository) {}

  async execute(input: DrawTeamsInput): Promise<Player[][]> {
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

    return DrawBalancerService.draw(selectedPlayers, input.teamsQuantity);
  }
}
