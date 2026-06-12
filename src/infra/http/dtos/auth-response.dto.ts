import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Usuário registrado com sucesso.' })
  message!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Login realizado com sucesso.' })
  message!: string;
}

export class RefreshResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Token atualizado com sucesso.' })
  message!: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Senha alterada com sucesso.' })
  message!: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Sessão encerrada com sucesso.' })
  message!: string;
}

export class UserDto {
  @ApiProperty({ example: 'c1b4432a-d2e3-4f9e-b123-e456f0f70a1c' })
  id!: string;

  @ApiProperty({ example: 'usuario@email.com' })
  email!: string;

  @ApiProperty({ example: 'usuario123' })
  username!: string;

  @ApiProperty({ example: 'USER' })
  role!: string;
}

export class UserDataDto {
  @ApiProperty({ type: UserDto })
  user!: UserDto;
}

export class GetMeResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Dados do usuário retornados com sucesso.' })
  message!: string;

  @ApiProperty({ type: UserDataDto })
  data!: UserDataDto;
}
