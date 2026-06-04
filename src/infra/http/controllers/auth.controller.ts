import {
  Body,
  Controller,
  Post,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { RegisterUser } from '../../../core/application/use-cases/register-user';
import { AuthenticateUser } from '../../../core/application/use-cases/authenticate-user';
import { ChangePassword } from '../../../core/application/use-cases/change-password';
import { RegisterUserBody } from '../dtos/register-user-body';
import { AuthenticateBody } from '../dtos/authenticate-body';
import { ChangePasswordBody } from '../dtos/change-password-body';
import { UserPresenter } from '../presenters/user-presenter';
import { AuthGuard } from '../guards/auth.guard';
import { type JwtPayload } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RefreshAccessToken } from '../../../core/application/use-cases/refresh-access-token';
import { LogoutUser } from '../../../core/application/use-cases/logout-user';
import { PasswordsDoNotMatchError } from '../../../core/domain/errors';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle({
  default: {
    ttl: 60000,
    limit: 5,
  },
})
export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUser: AuthenticateUser,
    private changePassword: ChangePassword,
    private refreshAccessToken: RefreshAccessToken,
    private logoutUser: LogoutUser,
  ) {}

  @Post('register')
  @ResponseMessage('Usuário registrado com sucesso.')
  async register(@Body() body: RegisterUserBody) {
    const { email, username, password, passwordConfirmation } = body;

    if (password !== passwordConfirmation) {
      throw new PasswordsDoNotMatchError();
    }

    const result = await this.registerUser.execute({
      email,
      username,
      password,
    });

    if (result.isFailure) {
      throw result.error;
    }

    return {
      user: UserPresenter.toHTTP(result.value),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login realizado com sucesso.')
  async login(@Body() body: AuthenticateBody) {
    const { identifier, password } = body;

    const result = await this.authenticateUser.execute({
      identifier,
      password,
    });

    if (result.isFailure) throw result.error;

    return {
      access_token: result.value.accessToken,
      refresh_token: result.value.refreshToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Token atualizado com sucesso.')
  async refresh(@Body() body: { refreshToken: string }) {
    const result = await this.refreshAccessToken.execute({
      refreshToken: body.refreshToken,
    });

    if (result.isFailure) throw result.error;

    return {
      access_token: result.value.accessToken,
      refresh_token: result.value.refreshToken,
    };
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @ResponseMessage('Senha alterada com sucesso.')
  async updatePassword(
    @Body() body: ChangePasswordBody,
    @CurrentUser() user: JwtPayload,
  ) {
    if (body.newPassword !== body.newPasswordConfirmation) {
      throw new PasswordsDoNotMatchError();
    }

    const result = await this.changePassword.execute({
      userId: user.sub,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    if (result.isFailure) throw result.error;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Sessão encerrada com sucesso.')
  async logout(@Body() body: { refreshToken: string }) {
    const result = await this.logoutUser.execute({
      refreshToken: body.refreshToken,
    });

    if (result.isFailure) throw result.error;
  }
}
