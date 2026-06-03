import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreatePeladaBody {
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
