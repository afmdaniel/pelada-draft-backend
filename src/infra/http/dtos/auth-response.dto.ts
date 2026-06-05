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
