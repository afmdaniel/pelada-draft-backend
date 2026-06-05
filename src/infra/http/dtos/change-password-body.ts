import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordBody {
  @ApiProperty({
    description: 'Senha atual do usuário.',
    example: 'senhaForte123',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    description: 'Senha com no mínimo 6 caracteres',
    example: 'senhaForte123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  newPassword!: string;

  @ApiProperty({
    description: 'Confirmação da senha. Deve ser idêntica ao campo password.',
    example: 'senhaForte123',
  })
  @IsNotEmpty()
  @IsString()
  newPasswordConfirmation!: string;
}
