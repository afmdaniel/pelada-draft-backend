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
  async list(@CurrentUser() user: JwtPayload) {
    const peladas = await this.listPelada.execute({
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
    @CurrentUser() user: JwtPayload,
  ) {
    const peladaDetails = await this.getPeladaById.execute({
      peladaId,
      currentUserId: user.sub,
      currentUserRole: user.role,
    });

    return { pelada: PeladaPresenter.toHTTPWithDetails(peladaDetails) };
  }

  @Put(':peladaId')
  async update(
    @Param('peladaId') peladaId: string,
    @Body() body: UpdatePeladaBody,
  ) {
    const pelada = await this.updatePelada.execute({
      peladaId,
      name: body.name,
    });

    return {
      pelada: PeladaPresenter.toHTTP(pelada),
    };
  }

  @Delete(':peladaId')
  async delete(@Param('peladaId') peladaId: string) {
    await this.deletePelada.execute({ peladaId });

    return { message: 'Pelada deletada com sucesso.' };
  }
}
