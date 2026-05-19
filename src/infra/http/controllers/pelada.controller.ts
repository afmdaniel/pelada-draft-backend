import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AddPlayerToPelada } from '../../../core/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../core/use-cases/get-player-by-pelada';
import { CreatePlayerBody } from '../dtos/create-player-body';
import { PlayerPresenter } from '../presenters/player-presenter';
import { DrawTeamsBody } from '../dtos/draw-teams-body';
import { DrawTeams } from '../../../core/use-cases/draw-teams';
import { DrawPresenter } from '../presenters/draw-presenter';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePelada } from '../../../core/use-cases/create-pelada';
import { CreatePeladaBody } from '../dtos/create-pelada-body';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtPayload } from '../guards/auth.guard';
import { PeladaPresenter } from '../presenters/pelada-presenter';
import { RequirePrivilege } from '../decorators/require-privilege.decorator';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';

@Controller('peladas')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaController {
  constructor(
    private createPelada: CreatePelada,
    private addPlayerToPelada: AddPlayerToPelada,
    private getPlayersByPelada: GetPlayersByPelada,
    private drawTeams: DrawTeams,
  ) {}

  @Post()
  async create(
    @Body() body: CreatePeladaBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const pelada = await this.createPelada.execute({
      ownerId: user.sub,
      name: body.name,
    });

    return {
      pelada: PeladaPresenter.toHTTP(pelada),
    };
  }

  @Post(':peladaId/players')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  async createPlayer(
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
  @RequirePrivilege(PeladaPrivilege.DRAW_TEAMS)
  async draw(@Param('peladaId') peladaId: string, @Body() body: DrawTeamsBody) {
    const result = await this.drawTeams.execute({ ...body, peladaId });

    return { draw: DrawPresenter.toHTTP(result) };
  }
}
