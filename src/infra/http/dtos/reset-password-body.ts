import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordBody {
  @ApiProperty({
    description: 'Token de redefinição de senha recebido por e-mail.',
    example: 'a1b2c3d4e5f6...',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty({
    description: 'Nova senha com no mínimo 6 caracteres.',
    example: 'novaSenhaForte123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  newPassword!: string;

  @ApiProperty({
    description:
      'Confirmação da nova senha. Deve ser idêntica ao campo newPassword.',
    example: 'novaSenhaForte123',
  })
  @IsNotEmpty()
  @IsString()
  newPasswordConfirmation!: string;
}
