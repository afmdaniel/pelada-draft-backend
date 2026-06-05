import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserBody {
  @ApiProperty({
    description: 'E-mail do usuário.',
    example: 'usuario@email.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'O e-mail informado deve ser válido.' })
  email!: string;

  @ApiProperty({
    description: 'Username do usuário.',
    example: 'usuario123',
    minLength: 3,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'O username deve ter entre 3 e 20 caracteres.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'O nome de usuário não pode conter espaços ou caracteres especiais. Use apenas letras, números e "_".',
  })
  username!: string;

  @ApiProperty({
    description: 'Senha com no mínimo 6 caracteres.',
    example: 'senhaForte123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password!: string;

  @ApiProperty({
    description: 'Confirmação da senha. Deve ser idêntica ao campo password.',
    example: 'senhaForte123',
  })
  @IsNotEmpty()
  @IsString()
  passwordConfirmation!: string;
}
