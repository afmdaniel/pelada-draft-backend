import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordBody {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  newPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPasswordConfirmation!: string;
}
