import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePeladaBody {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'O nome da pelada deve ter pelo menos 3 caracteres.',
  })
  name!: string;
}
