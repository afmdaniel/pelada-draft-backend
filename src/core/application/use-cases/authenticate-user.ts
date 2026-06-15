import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { HashGenerator } from '../../domain/services/hash-generator';
import { Encrypter } from '../../domain/services/encrypter';
import { randomUUID } from 'crypto';
import { authConfig } from '../../../infra/config/auth';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { InvalidPasswordError, UserNotFoundError } from '../../domain/errors';

interface AuthenticateUserInput {
  identifier: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

type AuthenticateUserOutput = Result<AuthTokens, AppError>;

@Injectable()
export class AuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
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

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id,
        role: user.role,
      },
      {
        secret: authConfig.jwt.accessTokenSecret!,
        expiresIn: authConfig.jwt
          .accessTokenExpiresIn! as JwtSignOptions['expiresIn'],
      },
    );

    const refreshTokenJti = randomUUID();
    const refreshToken = await this.encrypter.encrypt(
      { sub: user.id, jti: refreshTokenJti },
      {
        secret: authConfig.jwt.refreshTokenSecret!,
        expiresIn: authConfig.jwt
          .refreshTokenExpiresIn! as JwtSignOptions['expiresIn'],
      },
    );

    const currentTime = Date.now();
    const expiresInMs = ms(authConfig.jwt.refreshTokenExpiresIn as StringValue);
    const expiresAtDate = new Date(currentTime + expiresInMs);

    const refreshTokenData = RefreshToken.create({
      tokenJti: refreshTokenJti,
      userId: user.id,
      expiresAt: expiresAtDate,
    });

    if (refreshTokenData.isFailure) {
      return Result.fail(refreshTokenData.error);
    }

    await this.refreshTokenRepository.create(refreshTokenData.value);

    return Result.ok({ accessToken, refreshToken });
  }
}
