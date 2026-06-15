import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { HashGenerator } from '../../domain/services/hash-generator';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { InvalidPasswordError, UserNotFoundError } from '../../domain/errors';
import {
  TokenIssuerService,
  type AuthTokens,
} from '../services/token-issuer.service';

interface AuthenticateUserInput {
  identifier: string;
  password: string;
}

type AuthenticateUserOutput = Result<AuthTokens, AppError>;

@Injectable()
export class AuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
    private tokenIssuer: TokenIssuerService,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByIdentifier(input.identifier);

    if (!user) {
      return Result.fail(new UserNotFoundError());
    }

    if (!user.password) {
      return Result.fail(new InvalidPasswordError());
    }

    const isPasswordValid = await this.hashGenerator.compare(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      return Result.fail(new InvalidPasswordError());
    }

    return this.tokenIssuer.issueTokens(user.id, user.role!);
  }
}
