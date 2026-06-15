import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { randomUUID } from 'crypto';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { User } from '../../domain/entities/user.entity';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { authConfig } from '../../../infra/config/auth';

interface GoogleAuthenticateUserInput {
  googleId: string;
  email: string;
  displayName: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

type GoogleAuthenticateUserOutput = Result<AuthTokens, AppError>;

@Injectable()
export class GoogleAuthenticateUser {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(
    input: GoogleAuthenticateUserInput,
  ): Promise<GoogleAuthenticateUserOutput> {
    let user = await this.userRepository.findByGoogleId(input.googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(input.email);

      if (user) {
        await this.userRepository.updateGoogleId(user.id, input.googleId);
      } else {
        const username = await this.generateUniqueUsername(
          input.email,
          input.displayName,
        );

        const userOrError = User.create({
          email: input.email,
          username,
          googleId: input.googleId,
          authProvider: 'GOOGLE',
        });

        if (userOrError.isFailure) {
          return Result.fail(userOrError.error);
        }

        user = userOrError.value;
        await this.userRepository.create(user);
      }

      user = (await this.userRepository.findByGoogleId(input.googleId))!;
    }

    return this.issueTokens(user);
  }

  private async issueTokens(
    user: User,
  ): Promise<GoogleAuthenticateUserOutput> {
    const accessToken = await this.encrypter.encrypt(
      { sub: user.id, role: user.role },
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

    const expiresAtDate = new Date(
      Date.now() + ms(authConfig.jwt.refreshTokenExpiresIn as StringValue),
    );

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

  private async generateUniqueUsername(
    email: string,
    displayName: string,
  ): Promise<string> {
    const sanitized = (str: string) =>
      str.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_+|_+$/g, '');

    const fromDisplay = sanitized(displayName).slice(0, 15);
    const fromEmail = sanitized(email.split('@')[0]).slice(0, 15);

    const base = fromDisplay.length >= 3 ? fromDisplay : fromEmail;
    const candidate = base.length >= 3 ? base : 'user';

    const existing = await this.userRepository.findByUsername(candidate);
    if (!existing) return candidate;

    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `${candidate.slice(0, 11)}_${suffix}`;
  }
}
