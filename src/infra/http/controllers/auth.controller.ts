import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RegisterUser } from '../../../core/use-cases/register-user';
import { AuthenticateUser } from '../../../core/use-cases/authenticate-user';
import { ChangePassword } from '../../../core/use-cases/change-password';
import { RegisterUserBody } from '../dtos/register-user-body';
import { AuthenticateBody } from '../dtos/authenticate-body';
import { ChangePasswordBody } from '../dtos/change-password-body';
import { UserPresenter } from '../presenters/user-presenter';
import { AuthGuard } from '../guards/auth.guard';
import { type JwtPayload } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUser: AuthenticateUser,
    private changePassword: ChangePassword,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterUserBody) {
    const { email, username, password, passwordConfirmation } = body;

    if (password !== passwordConfirmation)
      throw new BadRequestException('As senhas não conferem.');

    const user = await this.registerUser.execute({
      email,
      username,
      password,
    });

    return {
      user: UserPresenter.toHTTP(user),
    };
  }

  @Post('login')
  async login(@Body() body: AuthenticateBody) {
    const { identifier, password } = body;

    const { accessToken } = await this.authenticateUser.execute({
      identifier,
      password,
    });

    return {
      access_token: accessToken,
    };
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  async updatePassword(
    @Body() body: ChangePasswordBody,
    @CurrentUser() user: JwtPayload,
  ) {
    if (body.newPassword !== body.newPasswordConfirmation)
      throw new BadRequestException('As senhas não conferem.');

    await this.changePassword.execute({
      userId: user.sub,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return {
      message: 'Senha alterada com sucesso.',
    };
  }
}
