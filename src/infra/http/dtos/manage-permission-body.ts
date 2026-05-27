import { IsNotEmpty, IsEnum, IsString, ValidateIf } from 'class-validator';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';

export class ManagePermissionBody {
  @IsNotEmpty()
  @IsString()
  userIdentifier!: string;

  @IsNotEmpty()
  @ValidateIf((o: ManagePermissionBody) => o.privilege !== 'ALL')
  @IsEnum(PeladaPrivilege)
  privilege!: PeladaPrivilege | 'ALL';

  @IsNotEmpty()
  @IsString()
  action!: 'ASSIGN' | 'REVOKE';
}
