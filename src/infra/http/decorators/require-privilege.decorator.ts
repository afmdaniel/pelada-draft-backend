import { SetMetadata } from '@nestjs/common';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';

export const PRIVILEGE_KEY = 'pelada_privilege';
export const RequirePrivilege = (privilege: PeladaPrivilege) =>
  SetMetadata(PRIVILEGE_KEY, privilege);
