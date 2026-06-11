import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ManagePeladaPermission } from '../../../core/application/use-cases/manage-pelada-permission';
import { ManagePermissionBody } from '../dtos/manage-permission-body';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { BaseResponseDto } from '../dtos/base-response.dto';
import { FetchPeladaUsers } from '../../../core/application/use-cases/fetch-pelada-users';
import { ListUsersWithPermissionResponseDto } from '../dtos/permission-response.dto';

@ApiTags('Permissões')
@ApiCookieAuth('access_token')
@Controller('peladas/:peladaId/permission')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPermissionController {
  constructor(
    private fetchPeladaUsers: FetchPeladaUsers,
    private managePeladaPermission: ManagePeladaPermission,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lista usuários com permissão para a pelada.',
  })
  @ApiOkResponse({
    type: ListUsersWithPermissionResponseDto,
    description: 'Lista de usuários retornada com sucesso.',
  })
  @ResponseMessage('Lista de usuários retornada com sucesso.')
  async fetchUsersWithPermission(@Param('peladaId') peladaId: string) {
    const result = await this.fetchPeladaUsers.execute({ peladaId });

    if (result.isFailure) {
      throw result.error;
    }

    return { users: result.value };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gerencia as permissões de um usuário em uma pelada',
  })
  @ApiOkResponse({
    type: BaseResponseDto,
    description: 'Permissão atualizada com sucesso.',
  })
  @ResponseMessage('Permissão atualizada com sucesso.')
  async manage(
    @Param('peladaId') peladaId: string,
    @Body() body: ManagePermissionBody,
  ) {
    const result = await this.managePeladaPermission.execute({
      peladaId,
      userIdentifier: body.userIdentifier,
      privilege: body.privilege,
      action: body.action,
    });

    if (result.isFailure) {
      throw result.error;
    }
  }
}
