import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreatePeladaBody {
  @ApiProperty({
    description:
      'Nome da pelada entre 3 e 30 caracteres, sem caracteres especiais.',
    example: 'Pelada Teste 123',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 30, {
    message: 'O nome da pelada deve ter entre 3 e 30 caracteres.',
  })
  @Matches(/^[a-zA-Z0-9À-ÿ ]+$/, {
    message:
      'O nome da pelada não pode conter caracteres especiais (como @, #, $, etc.).',
  })
  name!: string;
}
