import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DrawTeams } from '../../../core/application/use-cases/draw-teams';
import { DrawTeamsBody } from '../dtos/draw-teams-body';
import { DrawPresenter } from '../presenters/draw-presenter';
import { RequirePrivilege } from '../decorators/require-privilege.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { ResponseMessage } from '../decorators/response-message.decorator';

@ApiTags('Sorteio')
@ApiCookieAuth('access_token')
@Controller('peladas/:peladaId/draw')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaDrawController {
  constructor(private drawTeams: DrawTeams) {}

  @Post()
  @RequirePrivilege(PeladaPrivilege.DRAW_TEAMS)
  @ApiOperation({ summary: 'Realiza o sorteio de times para a pelada' })
  @ApiResponse({ status: 201, description: 'Sorteio realizado com sucesso.' })
  @ResponseMessage('Sorteio realizado com sucesso.')
  async draw(@Param('peladaId') peladaId: string, @Body() body: DrawTeamsBody) {
    const result = await this.drawTeams.execute({
      ...body,
      peladaId,
    });

    if (result.isFailure) {
      throw result.error;
    }

    return {
      draw: DrawPresenter.toHTTP(result.value),
    };
  }
}
