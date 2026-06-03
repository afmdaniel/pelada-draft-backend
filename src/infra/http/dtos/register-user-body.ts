import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserBody {
  @IsNotEmpty()
  @IsEmail({}, { message: 'O e-mail informado deve ser válido.' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'O username deve ter entre 3 e 20 caracteres.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'O nome de usuário não pode conter espaços ou caracteres especiais. Use apenas letras, números e "_".',
  })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password!: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirmation!: string;
}
