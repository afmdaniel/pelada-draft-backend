import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateBody {
  @IsNotEmpty()
  @IsString()
  identifier!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
