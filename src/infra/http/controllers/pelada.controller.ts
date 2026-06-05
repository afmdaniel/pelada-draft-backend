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
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreatePelada } from '../../../core/application/use-cases/create-pelada';
import { CreatePeladaBody } from '../dtos/create-pelada-body';
import { PeladaPresenter } from '../presenters/pelada-presenter';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RequirePrivilege } from '../decorators/require-privilege.decorator';
import { AuthGuard } from '../guards/auth.guard';
import type { JwtPayload } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { FetchUserPeladas } from '../../../core/application/use-cases/fetch-user-peladas';
import { GetPeladaById } from '../../../core/application/use-cases/get-pelada-by-id';
import { UpdatePelada } from '../../../core/application/use-cases/update-pelada';
import { UpdatePeladaBody } from '../dtos/update-pelada-body';
import { DeletePelada } from '../../../core/application/use-cases/detele-pelada';
import { ResponseMessage } from '../decorators/response-message.decorator';
import {
  CreatePeladaResponseDto,
  ListPeladasResponseDto,
  GetPeladaByIdResponseDto,
  UpdatePeladaResponseDto,
} from '../dtos/pelada-response.dto';
import { BaseResponseDto } from '../dtos/base-response.dto';

@ApiTags('Peladas')
@ApiCookieAuth('access_token')
@Controller('peladas')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaController {
  constructor(
    private createPelada: CreatePelada,
    private listPelada: FetchUserPeladas,
    private getPeladaById: GetPeladaById,
    private updatePelada: UpdatePelada,
    private deletePelada: DeletePelada,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova pelada' })
  @ApiCreatedResponse({
    type: CreatePeladaResponseDto,
    description: 'Pelada criada com sucesso.',
  })
  @ResponseMessage('Pelada criada com sucesso.')
  async create(
    @Body() body: CreatePeladaBody,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.createPelada.execute({
      ownerId: user.sub,
      name: body.name,
    });

    if (result.isFailure) throw result.error;

    return {
      pelada: PeladaPresenter.toHTTP(result.value),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as peladas do usuário logado' })
  @ApiOkResponse({
    type: ListPeladasResponseDto,
    description: 'Lista de peladas retornada com sucesso.',
  })
  async list(@CurrentUser() user: JwtPayload) {
    const result = await this.listPelada.execute({
      userId: user.sub,
      userRole: user.role,
    });

    if (result.isFailure) throw result.error;

    return {
      peladas: result.value.map((pelada) =>
        PeladaPresenter.toHTTPWithPermissions(pelada),
      ),
    };
  }

  @Get(':peladaId')
  @RequirePrivilege(PeladaPrivilege.MANAGE_PLAYERS, PeladaPrivilege.DRAW_TEAMS)
  @ApiOperation({ summary: 'Obtém detalhes de uma pelada pelo ID' })
  @ApiOkResponse({
    type: GetPeladaByIdResponseDto,
    description: 'Detalhes da pelada retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pelada não encontrada.' })
  async getById(
    @Param('peladaId') peladaId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.getPeladaById.execute({
      peladaId,
      currentUserId: user.sub,
      currentUserRole: user.role,
    });

    if (result.isFailure) throw result.error;

    return {
      pelada: PeladaPresenter.toHTTPWithDetails(result.value),
    };
  }

  @Put(':peladaId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza o nome da pelada' })
  @ApiOkResponse({
    type: UpdatePeladaResponseDto,
    description: 'Pelada atualizada com sucesso.',
  })
  @ResponseMessage('Pelada atualizada com sucesso.')
  async update(
    @Param('peladaId') peladaId: string,
    @Body() body: UpdatePeladaBody,
  ) {
    const result = await this.updatePelada.execute({
      peladaId,
      name: body.name,
    });

    if (result.isFailure) throw result.error;

    return {
      pelada: PeladaPresenter.toHTTP(result.value),
    };
  }

  @Delete(':peladaId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deleta uma pelada' })
  @ApiOkResponse({
    type: BaseResponseDto,
    description: 'Pelada deletada com sucesso.',
  })
  @ResponseMessage('Pelada deletada com sucesso.')
  async delete(@Param('peladaId') peladaId: string) {
    const result = await this.deletePelada.execute({ peladaId });

    if (result.isFailure) throw result.error;
  }
}
