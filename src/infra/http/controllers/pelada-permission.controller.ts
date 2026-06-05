import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ManagePeladaPermission } from '../../../core/application/use-cases/manage-pelada-permission';
import { ManagePermissionBody } from '../dtos/manage-permission-body';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { ResponseMessage } from '../decorators/response-message.decorator';

@ApiTags('Permissões')
@ApiCookieAuth('access_token')
@Controller('peladas/:peladaId/permission')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPermissionController {
  constructor(private managePeladaPermission: ManagePeladaPermission) {}

  @Post()
  @HttpCode(HttpStatus.OK) // Garante que a resposta seja 200 OK
  @ApiOperation({
    summary: 'Gerencia as permissões de um usuário em uma pelada',
  })
  @ApiResponse({
    status: 200,
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
