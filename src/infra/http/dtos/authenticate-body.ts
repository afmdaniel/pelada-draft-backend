import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateBody {
  @ApiProperty({
    description: 'E-mail válido ou username do usuário.',
    examples: ['usuario@email.com', 'usuario123'],
  })
  @IsNotEmpty()
  @IsString()
  identifier!: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'senhaForte123',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
