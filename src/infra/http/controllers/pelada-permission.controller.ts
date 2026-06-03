import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ManagePeladaPermission } from '../../../core/application/use-cases/manage-pelada-permission';
import { ManagePermissionBody } from '../dtos/manage-permission-body';
import { AuthGuard } from '../guards/auth.guard';
import { PeladaAccessGuard } from '../guards/pelada-access.guard';

@Controller('peladas/:peladaId/permission')
@UseGuards(AuthGuard, PeladaAccessGuard)
export class PeladaPermissionController {
  constructor(private managePeladaPermission: ManagePeladaPermission) {}

  @Post()
  async manage(
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
