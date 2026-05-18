import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AddPlayerToPelada } from '../../../core/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../core/use-cases/get-player-by-pelada';
import { CreatePlayerBody } from '../dtos/create-player-body';
import { PlayerPresenter } from '../presenters/player-presenter';
import { DrawTeamsBody } from '../dtos/draw-teams-body';
import { DrawTeams } from '../../../core/use-cases/draw-teams';
import { DrawPresenter } from '../presenters/draw-presenter';
import { AuthGuard } from '../guards/auth.guard';

@Controller('peladas')
@UseGuards(AuthGuard)
export class PeladaController {
  constructor(
    private addPlayerToPelada: AddPlayerToPelada,
    private getPlayersByPelada: GetPlayersByPelada,
    private drawTeams: DrawTeams,
  ) {}

  @Post(':peladaId/players')
  async create(
    @Param('peladaId') peladaId: string,
    @Body() body: CreatePlayerBody,
  ) {
    const { name, stars, position } = body;

    const player = await this.addPlayerToPelada.execute({
      name,
      stars,
      position,
      peladaId,
    });

    return {
      player: PlayerPresenter.toHTTP(player),
    };
  }

  @Get(':peladaId/players')
  async listPlayersByPelada(@Param('peladaId') peladaId: string) {
    const players = await this.getPlayersByPelada.execute({
      peladaId,
    });

    return {
      players: players.map((player) => PlayerPresenter.toHTTP(player)),
    };
  }

  @Post(':peladaId/draw')
  async draw(@Param('peladaId') peladaId: string, @Body() body: DrawTeamsBody) {
    const result = await this.drawTeams.execute({ ...body, peladaId });

    return { draw: DrawPresenter.toHTTP(result) };
  }
}
