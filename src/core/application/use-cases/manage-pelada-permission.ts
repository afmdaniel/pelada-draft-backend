import { Injectable } from '@nestjs/common';
import { PeladaRepository } from '../../domain/repositories/pelada-repository';
import { UserRepository } from '../../domain/repositories/user-repository';
import {
  PELADA_PRIVILEGES,
  PeladaPermission,
  PeladaPrivilege,
} from '../../domain/entities/pelada-permission.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  InvalidPermissionActionError,
  OwnerImplicitAccessError,
  PeladaNotFoundError,
  UserNotFoundError,
} from '../../domain/errors';

interface ManagePermissionInput {
  peladaId: string;
  userIdentifier: string;
  privilege: PeladaPrivilege | 'ALL';
  action: 'ASSIGN' | 'REVOKE';
}

type ManagePermissionOutput = Result<void, AppError>;

@Injectable()
export class ManagePeladaPermission {
  constructor(
    private peladaRepository: PeladaRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(input: ManagePermissionInput): Promise<ManagePermissionOutput> {
    const targetUser = await this.userRepository.findByIdentifier(
      input.userIdentifier,
    );

    if (!targetUser) {
      return Result.fail(new UserNotFoundError());
    }

    const pelada = await this.peladaRepository.findById(input.peladaId);

    if (!pelada) {
      return Result.fail(new PeladaNotFoundError());
    }

    if (pelada.ownerId === targetUser.id) {
      return Result.fail(new OwnerImplicitAccessError());
    }

    if (input.action !== 'ASSIGN' && input.action !== 'REVOKE') {
      return Result.fail(new InvalidPermissionActionError());
    }

    const privilegesToProcess =
      input.privilege === 'ALL'
        ? Object.values(PELADA_PRIVILEGES)
        : [input.privilege];

    const peladaPermissions: PeladaPermission[] = [];

    for (const privilege of privilegesToProcess) {
      const permissionOrError = PeladaPermission.create({
        userId: targetUser.id,
        peladaId: pelada.id!,
        privilege,
      });

      if (permissionOrError.isFailure) {
        return Result.fail(permissionOrError.error);
      }

      peladaPermissions.push(permissionOrError.value);
    }

    if (input.action === 'ASSIGN') {
      await this.peladaRepository.assignPermissions(peladaPermissions);
    } else {
      await this.peladaRepository.revokePermissions(
        targetUser.id,
        pelada.id!,
        privilegesToProcess,
      );
    }

    return Result.ok<void>(undefined);
  }
}
