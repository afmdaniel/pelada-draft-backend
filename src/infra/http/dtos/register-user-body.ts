// src/infra/http/dtos/register-user-body.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserBody {
  @IsNotEmpty()
  @IsEmail({}, { message: 'O e-mail informado deve ser válido.' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
  })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password!: string;
}
