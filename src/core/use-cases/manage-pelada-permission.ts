import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PeladaRepository } from '../repositories/pelada-repository';
import { UserRepository } from '../repositories/user-repository';
import {
  PELADA_PRIVILEGES,
  PeladaPermission,
  PeladaPrivilege,
} from '../entities/pelada-permission.entity';

interface ManagePermissionInput {
  peladaId: string;
  userIdentifier: string;
  privilege: PeladaPrivilege | 'ALL';
  action: 'ASSIGN' | 'REVOKE';
}

@Injectable()
export class ManagePeladaPermission {
  constructor(
    private peladaRepository: PeladaRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(input: ManagePermissionInput): Promise<void> {
    const targetUser = await this.userRepository.findByIdentifier(
      input.userIdentifier,
    );

    if (!targetUser) {
      throw new NotFoundException(
        'Usuário com o e-mail ou username informado não foi encontrado.',
      );
    }

    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      throw new NotFoundException('Pelada não encontrada.');
    }

    if (pelada.ownerId === targetUser.id) {
      throw new BadRequestException(
        'O dono da pelada já possui acesso total implícito.',
      );
    }

    const privilegesToProcess =
      input.privilege === 'ALL'
        ? Object.values(PELADA_PRIVILEGES)
        : [input.privilege];

    const peladaPermissions = privilegesToProcess.map(
      (privilege) =>
        new PeladaPermission({
          userId: targetUser.id,
          peladaId: pelada.id!,
          privilege,
        }),
    );

    if (input.action === 'ASSIGN') {
      await this.peladaRepository.assignPermissions(peladaPermissions);
    } else if (input.action === 'REVOKE') {
      await this.peladaRepository.revokePermissions(
        targetUser.id,
        pelada.id!,
        privilegesToProcess,
      );
    } else {
      throw new BadRequestException('Ação de permissão inválida.');
    }
  }
}
