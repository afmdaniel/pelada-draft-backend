import { PeladaPermission as PrismaPeladaPermission } from '../../generated/prisma/client';
import { PeladaPermission as PeladaPermissionEntity } from '../../../../core/domain/entities/pelada-permission.entity';
import { DataCorruptionError } from '../../../../core/domain/errors';

export class PrismaPeladaPermissionMapper {
  static toDomain(raw: PrismaPeladaPermission): PeladaPermissionEntity {
    const permissionOrError = PeladaPermissionEntity.create({
      id: raw.id,
      userId: raw.userId,
      peladaId: raw.peladaId,
      privilege: raw.privilege,
    });

    if (permissionOrError.isFailure) {
      throw new DataCorruptionError(
        `Falha ao mapear PeladaPermission (ID: ${raw.id}). Motivo: ${permissionOrError.error.message}`,
      );
    }

    return permissionOrError.value;
  }

  static toPrisma(peladaPermission: PeladaPermissionEntity) {
    return {
      id: peladaPermission.id,
      userId: peladaPermission.userId,
      peladaId: peladaPermission.peladaId,
      privilege: peladaPermission.privilege,
    };
  }
}
