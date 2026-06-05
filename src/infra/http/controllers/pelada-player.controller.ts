import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
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
import { ResponseMessage } from '../decorators/response-message.decorator';
import {
  CreatePlayerResponseDto,
  ListPlayersResponseDto,
  UpdatePlayerResponseDto,
} from '../dtos/player-response.dto';
import { BaseResponseDto } from '../dtos/base-response.dto';

@ApiTags('Jogadores')
@ApiCookieAuth('access_token')
@Controller('peladas/:peladaId/players')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPlayerController {
  constructor(
    private addPlayer: AddPlayerToPelada,
    private listPlayers: GetPlayersByPelada,
    private updatePlayer: UpdatePlayer,
    private deletePlayer: DeletePlayer,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona um jogador à pelada' })
  @ApiCreatedResponse({
    type: CreatePlayerResponseDto,
    description: 'Jogador adicionado com sucesso.',
  })
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  @ResponseMessage('Jogador adicionado com sucesso.')
  async create(
    @Param('peladaId') peladaId: string,
    @Body() body: CreatePlayerBody,
  ) {
    const { name, stars, position } = body;

    const result = await this.addPlayer.execute({
      name,
      stars,
      position,
      peladaId,
    });

    if (result.isFailure) throw result.error;

    return {
      player: PlayerPresenter.toHTTP(result.value),
    };
  }

  @Get('')
  @ApiOperation({ summary: 'Lista os jogadores da pelada' })
  @ApiOkResponse({
    type: ListPlayersResponseDto,
    description: 'Lista de jogadores retornada com sucesso.',
  })
  @RequirePrivilege(PeladaPrivilege.DRAW_TEAMS, PeladaPrivilege.MANAGE_PLAYERS)
  async list(@Param('peladaId') peladaId: string) {
    const result = await this.listPlayers.execute({
      peladaId,
    });

    if (result.isFailure) throw result.error;

    return {
      players: result.value.map((player) => PlayerPresenter.toHTTP(player)),
    };
  }

  @Put(':playerId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  @ApiOperation({ summary: 'Atualiza os dados de um jogador' })
  @ApiOkResponse({
    type: UpdatePlayerResponseDto,
    description: 'Jogador atualizado com sucesso.',
  })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Jogador atualizado com sucesso.')
  async update(
    @Param('peladaId') peladaId: string,
    @Param('playerId') playerId: string,
    @Body() body: UpdatePlayerBody,
  ) {
    const result = await this.updatePlayer.execute({
      peladaId,
      playerId,
      name: body.name,
      stars: body.stars,
      position: body.position,
    });

    if (result.isFailure) throw result.error;

    return {
      player: PlayerPresenter.toHTTP(result.value),
    };
  }

  @Delete(':playerId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS)
  @ApiOperation({ summary: 'Remove um jogador da pelada' })
  @ApiOkResponse({
    type: BaseResponseDto,
    description: 'Jogador removido com sucesso.',
  })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Jogador removido com sucesso.')
  async delete(
    @Param('peladaId') peladaId: string,
    @Param('playerId') playerId: string,
  ) {
    const result = await this.deletePlayer.execute({
      peladaId,
      playerId,
    });

    if (result.isFailure) throw result.error;
  }
}
