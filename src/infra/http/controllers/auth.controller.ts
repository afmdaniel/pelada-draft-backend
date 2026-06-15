import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { type Response, type Request } from 'express';
import ms, { StringValue } from 'ms';
import { RegisterUser } from '../../../core/application/use-cases/register-user';
import { AuthenticateUser } from '../../../core/application/use-cases/authenticate-user';
import { ChangePassword } from '../../../core/application/use-cases/change-password';
import { GetMe } from '../../../core/application/use-cases/get-me';
import { RegisterUserBody } from '../dtos/register-user-body';
import { AuthenticateBody } from '../dtos/authenticate-body';
import { ChangePasswordBody } from '../dtos/change-password-body';
import { AuthGuard } from '../guards/auth.guard';
import { type JwtPayload } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RefreshAccessToken } from '../../../core/application/use-cases/refresh-access-token';
import { LogoutUser } from '../../../core/application/use-cases/logout-user';
import { GoogleAuthenticateUser } from '../../../core/application/use-cases/google-authenticate-user';
import {
  MissingRefreshTokenError,
  PasswordsDoNotMatchError,
} from '../../../core/domain/errors';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { type GoogleProfile } from '../auth/google.strategy';
import {
  RegisterResponseDto,
  LoginResponseDto,
  RefreshResponseDto,
  ChangePasswordResponseDto,
  LogoutResponseDto,
  GetMeResponseDto,
} from '../dtos/auth-response.dto';
import { UserPresenter } from '../presenters/user-presenter';

@ApiTags('Autenticação')
@Controller('auth')
@Throttle({
  default: {
    ttl: 60000,
    limit: 5,
  },
})
export class AuthController {
  private readonly cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  constructor(
    private registerUser: RegisterUser,
    private authenticateUser: AuthenticateUser,
    private changePassword: ChangePassword,
    private refreshAccessToken: RefreshAccessToken,
    private logoutUser: LogoutUser,
    private getMe: GetMe,
    private googleAuthenticateUser: GoogleAuthenticateUser,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário no sistema' })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'Usuário criado com sucesso.',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail ou Username já estão em uso.',
  })
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
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário no sistema' })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Login realizado com sucesso.',
  })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login realizado com sucesso.')
  async login(
    @Body() body: AuthenticateBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { identifier, password } = body;

    const result = await this.authenticateUser.execute({
      identifier,
      password,
    });

    if (result.isFailure) throw result.error;

    this.setAuthCookies(
      res,
      result.value.accessToken,
      result.value.refreshToken,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Atualiza o token de acesso.' })
  @ApiOkResponse({
    type: RefreshResponseDto,
    description: 'Token atualizado com sucesso.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ResponseMessage('Token atualizado com sucesso.')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new MissingRefreshTokenError();
    }

    const result = await this.refreshAccessToken.execute({ refreshToken });
    if (result.isFailure) throw result.error;

    this.setAuthCookies(
      res,
      result.value.accessToken,
      result.value.refreshToken,
    );
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Atualiza senha do usuário.' })
  @ApiOkResponse({
    type: ChangePasswordResponseDto,
    description: 'Senha alterada com sucesso.',
  })
  @UseGuards(AuthGuard)
  @ApiCookieAuth('access_token')
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
  @ApiOperation({ summary: 'Encerra sessão do usuário.' })
  @ApiOkResponse({
    type: LogoutResponseDto,
    description: 'Sessão encerrada com sucesso.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ResponseMessage('Sessão encerrada com sucesso.')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string;

    const result = await this.logoutUser.execute({
      refreshToken,
    });

    if (result.isFailure) throw result.error;

    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);
  }


  @Get('me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Retorna os dados do usuário logado' })
  @ApiOkResponse({
    type: GetMeResponseDto,
    description: 'Dados do usuário retornados com sucesso.',
  })
  @ResponseMessage('Dados do usuário retornados com sucesso.')
  async me(@CurrentUser() user: JwtPayload) {
    const result = await this.getMe.execute(user.sub);

    if (result.isFailure) {
      throw result.error;
    }

    return {
      user: UserPresenter.toHTTP(result.value),
    };
  }

  @Get('google')
  @ApiOperation({ summary: 'Inicia o fluxo de autenticação via Google OAuth.' })
  @ApiResponse({ status: 302, description: 'Redireciona para o Google.' })
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redireciona para o Google automaticamente
  }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: Request & { user: GoogleProfile },
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const result = await this.googleAuthenticateUser.execute(req.user);

    if (result.isFailure) {
      return res.redirect(`${frontendUrl}/auth/error?reason=google_auth_failed`);
    }

    this.setAuthCookies(res, result.value.accessToken, result.value.refreshToken);

    return res.redirect(`${frontendUrl}/peladas`);
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const accessTtl = process.env.JWT_EXPIRES_IN || '15m';
    const refreshTtl = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

    res.cookie('access_token', accessToken, {
      ...this.cookieOptions,
      maxAge: ms(accessTtl as StringValue),
    });

    res.cookie('refresh_token', refreshToken, {
      ...this.cookieOptions,
      maxAge: ms(refreshTtl as StringValue),
    });

    res.cookie('has_session', 1, {
      ...this.cookieOptions,
      maxAge: ms(refreshTtl as StringValue),
    });
  }
}
