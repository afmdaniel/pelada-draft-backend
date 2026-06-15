import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { randomUUID } from 'node:crypto';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { authConfig } from '../../../infra/config/auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenIssuerService {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async issueTokens(
    userId: string,
    role: string,
  ): Promise<Result<AuthTokens, AppError>> {
    const accessToken = await this.encrypter.encrypt(
      { sub: userId, role },
      {
        secret: authConfig.jwt.accessTokenSecret!,
        expiresIn: authConfig.jwt
          .accessTokenExpiresIn! as JwtSignOptions['expiresIn'],
      },
    );

    const refreshTokenJti = randomUUID();
    const refreshToken = await this.encrypter.encrypt(
      { sub: userId, jti: refreshTokenJti },
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
      userId,
      expiresAt: expiresAtDate,
    });

    if (refreshTokenData.isFailure) {
      return Result.fail(refreshTokenData.error);
    }

    await this.refreshTokenRepository.create(refreshTokenData.value);

    return Result.ok({ accessToken, refreshToken });
  }
}
