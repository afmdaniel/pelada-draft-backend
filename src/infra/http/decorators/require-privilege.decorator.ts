import { SetMetadata } from '@nestjs/common';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';

export const PRIVILEGE_KEY = 'pelada_privilege';
export const RequirePrivilege = (...privileges: PeladaPrivilege[]) =>
  SetMetadata(PRIVILEGE_KEY, privileges);
