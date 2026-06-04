import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import ms, { StringValue } from 'ms';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { authConfig } from '../../../infra/config/auth';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { AppError } from '../../domain/errors/app-error';
import { Result } from '../../domain/logic/result';
import { InvalidTokenError, UserNotFoundError } from '../../domain/errors';

interface RefreshAccessTokenInput {
  refreshToken: string;
}

type RefreshAccessTokenOutput = Result<
  {
    accessToken: string;
    refreshToken: string;
  },
  AppError
>;

@Injectable()
export class RefreshAccessToken {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(
    input: RefreshAccessTokenInput,
  ): Promise<RefreshAccessTokenOutput> {
    let payload: Record<string, any>;

    try {
      payload = await this.encrypter.decrypt(
        input.refreshToken,
        authConfig.jwt.refreshTokenSecret!,
      );
    } catch {
      return Result.fail(new InvalidTokenError());
    }

    const currentRefreshToken = await this.refreshTokenRepository.findByJti(
      payload.jti as string,
    );
    if (!currentRefreshToken || currentRefreshToken.isExpired()) {
      return Result.fail(new InvalidTokenError());
    }

    const user = await this.userRepository.findById(payload.sub as string);
    if (!user) return Result.fail(new UserNotFoundError());

    await this.refreshTokenRepository.deleteByJti(payload.jti as string);

    const newRefreshTokenJti = randomUUID();
    const newAccessToken = await this.encrypter.encrypt(
      { sub: user.id, role: user.role },
      {
        secret: authConfig.jwt.accessTokenSecret!,
        expiresIn: authConfig.jwt
          .accessTokenExpiresIn! as JwtSignOptions['expiresIn'],
      },
    );

    const newRefreshToken = await this.encrypter.encrypt(
      { sub: user.id, jti: newRefreshTokenJti },
      {
        secret: authConfig.jwt.refreshTokenSecret!,
        expiresIn: authConfig.jwt
          .refreshTokenExpiresIn! as JwtSignOptions['expiresIn'],
      },
    );

    const currentTime = Date.now();
    const expiresInMs = ms(authConfig.jwt.refreshTokenExpiresIn as StringValue);
    const expiresAtDate = new Date(currentTime + expiresInMs);

    const refreshTokenOrError = RefreshToken.create({
      tokenJti: newRefreshTokenJti,
      userId: user.id,
      expiresAt: expiresAtDate,
    });

    if (refreshTokenOrError.isFailure) {
      return Result.fail(refreshTokenOrError.error);
    }

    await this.refreshTokenRepository.create(refreshTokenOrError.value);

    return Result.ok({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
}
