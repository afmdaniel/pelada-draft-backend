import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { RegisterUser } from '../../../core/use-cases/register-user';
import { AuthenticateUser } from '../../../core/use-cases/authenticate-user';
import { RegisterUserBody } from '../dtos/register-user-body';
import { AuthenticateBody } from '../dtos/authenticate-body';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private authenticateUser: AuthenticateUser,
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
}
