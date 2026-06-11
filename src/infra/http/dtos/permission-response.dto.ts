import { ApiProperty } from '@nestjs/swagger';
import { PeladaPrivilege } from '../../database/generated/prisma/enums';

export class UserWithPermissionsDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'johndoe123',
  })
  username!: string;

  @ApiProperty({
    description: 'email do usuário',
    example: 'johndoe123@domain.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Lista de permissões do usuário na pelada',
    enum: PeladaPrivilege,
    isArray: true,
    example: [PeladaPrivilege.MANAGE_PLAYERS, PeladaPrivilege.DRAW_TEAMS],
  })
  privileges!: PeladaPrivilege[];
}

export class ListUsersWithPermissionResponseDto {
  @ApiProperty({
    description: 'Lista de usuários e suas respectivas permissões',
    type: [UserWithPermissionsDto],
  })
  users!: UserWithPermissionsDto[];
}
