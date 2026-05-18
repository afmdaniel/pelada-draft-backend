// src/infra/http/controllers/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUser } from '../../../core/use-cases/register-user';
import { RegisterUserBody } from '../dtos/register-user-body';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('auth')
export class AuthController {
  constructor(private registerUser: RegisterUser) {}

  @Post('register')
  async register(@Body() body: RegisterUserBody) {
    const { email, username, password } = body;

    const user = await this.registerUser.execute({
      email,
      username,
      password,
    });

    return {
      user: UserPresenter.toHTTP(user),
    };
  }
}
