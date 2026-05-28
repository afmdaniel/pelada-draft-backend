import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AddPlayerToPelada } from '../../../core/use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from '../../../core/use-cases/get-player-by-pelada';
import { DrawTeams } from '../../../core/use-cases/draw-teams';
import { ManagePeladaPermission } from '../../../core/use-cases/manage-pelada-permission';
import { CreatePelada } from '../../../core/use-cases/create-pelada';
import { CreatePlayerBody } from '../dtos/create-player-body';
import { DrawTeamsBody } from '../dtos/draw-teams-body';
import { CreatePeladaBody } from '../dtos/create-pelada-body';
import { ManagePermissionBody } from '../dtos/manage-permission-body';
import { PlayerPresenter } from '../presenters/player-presenter';
import { DrawPresenter } from '../presenters/draw-presenter';
import { PeladaPresenter } from '../presenters/pelada-presenter';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RequirePrivilege } from '../decorators/require-privilege.decorator';
import { AuthGuard } from '../guards/auth.guard';
import type { JwtPayload } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { FetchUserPeladas } from '../../../core/use-cases/fetch-user-peladas';
import { GetPeladaById } from '../../../core/use-cases/get-pelada-by-id';

@Controller('peladas')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaController {
  constructor(
    private createPelada: CreatePelada,
    private addPlayerToPelada: AddPlayerToPelada,
    private getPlayersByPelada: GetPlayersByPelada,
    private drawTeams: DrawTeams,
    private managePeladaPermission: ManagePeladaPermission,
    private fetchUserPeladas: FetchUserPeladas,
    private getPeladaById: GetPeladaById,
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

  @Get()
  async listAll(@CurrentUser() user: JwtPayload) {
    const peladas = await this.fetchUserPeladas.execute({
      userId: user.sub,
      userRole: user.role,
    });

    return {
      peladas: peladas.map((pelada) =>
        PeladaPresenter.toHTTPWithPermissions(pelada),
      ),
    };
  }

  @Get(':peladaId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS, PeladaPrivilege.DRAW_TEAMS)
  async getById(
    @Param('peladaId') peladaId: string,
    @CurrentUser() user: JwtPayload, // 🎯 Captura o usuário logado
  ) {
    const peladaDetails = await this.getPeladaById.execute({
      peladaId,
      currentUserId: user.sub,
      currentUserRole: user.role,
    });

    return { pelada: PeladaPresenter.toHTTPWithDetails(peladaDetails) };
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
  @RequirePrivilege(PeladaPrivilege.DRAW_TEAMS, PeladaPrivilege.MANAGE_PLAYERS)
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

  @Post(':peladaId/permission')
  async managePermission(
    @Param('peladaId') peladaId: string,
    @Body() body: ManagePermissionBody,
  ) {
    await this.managePeladaPermission.execute({
      peladaId,
      userIdentifier: body.userIdentifier,
      privilege: body.privilege,
      action: body.action,
    });

    return { message: 'Permissão atualizada com sucesso.' };
  }
}
