import { IsNotEmpty, IsEnum, IsString, ValidateIf } from 'class-validator';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ManagePermissionBody {
  @ApiProperty({
    description: 'E-mail válido ou username do usuário.',
    example: 'usuario@email.com',
  })
  @IsNotEmpty()
  @IsString()
  userIdentifier!: string;

  @ApiProperty({
    description: 'Permissão a ser concedida ou revogada.',
    enum: PeladaPrivilege,
    example: 'DRAW_TEAMS',
  })
  @IsNotEmpty()
  @ValidateIf((o: ManagePermissionBody) => o.privilege !== 'ALL')
  @IsEnum(PeladaPrivilege)
  privilege!: PeladaPrivilege | 'ALL';

  @ApiProperty({
    description: 'Ação a ser realizada. Pode ser "ASSIGN" ou "REVOKE".',
    enum: ['ASSIGN', 'REVOKE'],
    example: 'ASSING',
  })
  @IsNotEmpty()
  @IsString()
  action!: 'ASSIGN' | 'REVOKE';
}
