import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { AddPlayerToPelada } from '../../../core/application/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../core/application/use-cases/get-player-by-pelada';
import { CreatePlayerBody } from '../dtos/create-player-body';
import { PlayerPresenter } from '../presenters/player-presenter';
import { RequirePrivilege } from '../decorators/require-privilege.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { UpdatePlayer } from '../../../core/application/use-cases/update-player';
import { UpdatePlayerBody } from '../dtos/update-player-body';
import { DeletePlayer } from '../../../core/application/use-cases/delete-player';

@Controller('peladas/:peladaId/players')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPlayerController {
  constructor(
    private addPlayer: AddPlayerToPelada,
    private listPlayers: GetPlayersByPelada,
    private updatePlayer: UpdatePlayer,
    private deletePlayer: DeletePlayer,
  ) {}
  @Post('')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  async create(
    @Param('peladaId') peladaId: string,
    @Body() body: CreatePlayerBody,
  ) {
    const { name, stars, position } = body;

    const player = await this.addPlayer.execute({
      name,
      stars,
      position,
      peladaId,
    });

    return {
      player: PlayerPresenter.toHTTP(player),
    };
  }

  @Get('')
  @RequirePrivilege(PeladaPrivilege.DRAW_TEAMS, PeladaPrivilege.MANAGE_PLAYERS)
  async list(@Param('peladaId') peladaId: string) {
    const players = await this.listPlayers.execute({
      peladaId,
    });

    return {
      players: players.map((player) => PlayerPresenter.toHTTP(player)),
    };
  }

  @Put(':playerId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  async update(
    @Param('peladaId') peladaId: string,
    @Param('playerId') playerId: string,
    @Body() body: UpdatePlayerBody,
  ) {
    const player = await this.updatePlayer.execute({
      peladaId,
      playerId,
      name: body.name,
      stars: body.stars,
      position: body.position,
    });

    return { player: PlayerPresenter.toHTTP(player) };
  }

  @Delete(':playerId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  async delete(
    @Param('peladaId') peladaId: string,
    @Param('playerId') playerId: string,
  ) {
    await this.deletePlayer.execute({
      peladaId,
      playerId,
    });

    return { message: 'Jogador removido com sucesso.' };
  }
}
