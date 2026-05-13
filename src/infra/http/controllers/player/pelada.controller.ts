import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AddPlayerToPelada } from '../../../../core/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../../core/use-cases/get-player-by-pelada';
import { CreatePlayerBody } from '../../dtos/create-player-body';
import { PlayerPresenter } from '../../presenters/player-presenter';

@Controller('peladas')
export class PeladaController {
  constructor(
    private addPlayerToPelada: AddPlayerToPelada,
    private getPlayersByPelada: GetPlayersByPelada,
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
}
