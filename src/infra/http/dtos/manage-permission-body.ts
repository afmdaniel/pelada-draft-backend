import { IsNotEmpty, IsEnum, IsString, ValidateIf } from 'class-validator';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ManagePermissionBody {
  @ApiProperty({
    description: 'E-mail válido ou username do usuário.',
    examples: ['usuario@email.com', 'usuario123'],
  })
  @IsNotEmpty()
  @IsString()
  userIdentifier!: string;

  @ApiProperty({
    description: 'Permissão a ser concedida ou revogada.',
    enum: PeladaPrivilege,
    examples: ['DRAW_TEAMS', 'MANAGE_PLAYERS'],
  })
  @IsNotEmpty()
  @ValidateIf((o: ManagePermissionBody) => o.privilege !== 'ALL')
  @IsEnum(PeladaPrivilege)
  privilege!: PeladaPrivilege | 'ALL';

  @ApiProperty({
    description: 'Ação a ser realizada. Pode ser "ASSIGN" ou "REVOKE".',
    examples: ['ASSIGN', 'REVOKE'],
  })
  @IsNotEmpty()
  @IsString()
  action!: 'ASSIGN' | 'REVOKE';
}
