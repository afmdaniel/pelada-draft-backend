import { PeladaPermission as PrismaPeladaPermission } from '../../generated/prisma/client';
import { PeladaPermission as PeladaPermissionEntity } from '../../../../core/domain/entities/pelada-permission.entity';

export class PrismaPeladaPermissionMapper {
  static toDomain(raw: PrismaPeladaPermission): PeladaPermissionEntity {
    return new PeladaPermissionEntity({
      id: raw.id,
      userId: raw.userId,
      peladaId: raw.peladaId,
      privilege: raw.privilege,
    });
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
