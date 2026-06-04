import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ManagePeladaPermission } from '../../../core/application/use-cases/manage-pelada-permission';
import { ManagePermissionBody } from '../dtos/manage-permission-body';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';
import { ResponseMessage } from '../decorators/response-message.decorator';

@Controller('peladas/:peladaId/permission')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPermissionController {
  constructor(private managePeladaPermission: ManagePeladaPermission) {}

  @Post()
  @HttpCode(HttpStatus.OK) // Garante que a resposta seja 200 OK
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
