import { UserWithPermissions } from '../../../../core/application/dtos/user-with-permissions.dto';
import { PeladaPrivilege } from '../../../../core/domain/entities/pelada-permission.entity';

type PrismaUserWithPermissions = {
  username: string;
  email: string;
  permissions: {
    privilege: string;
  }[];
};

export class PrismaUserWithPermissionsMapper {
  static toDomain(raw: PrismaUserWithPermissions): UserWithPermissions {
    return {
      username: raw.username,
      email: raw.email,
      privileges: raw.permissions.map((p) => p.privilege as PeladaPrivilege),
    };
  }
}
