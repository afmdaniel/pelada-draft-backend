import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordBody {
  @ApiProperty({
    description: 'E-mail do usuário cadastrado.',
    example: 'usuario@email.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'O e-mail informado deve ser válido.' })
  email!: string;
}
