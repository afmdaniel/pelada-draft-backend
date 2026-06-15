import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { authConfig } from '../../../infra/config/auth';
import { AppError } from '../../domain/errors/app-error';
import { Result } from '../../domain/logic/result';
import { InvalidTokenError, UserNotFoundError } from '../../domain/errors';
import {
  TokenIssuerService,
  type AuthTokens,
} from '../services/token-issuer.service';

interface RefreshAccessTokenInput {
  refreshToken: string;
}

type RefreshAccessTokenOutput = Result<AuthTokens, AppError>;

@Injectable()
export class RefreshAccessToken {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private encrypter: Encrypter,
    private tokenIssuer: TokenIssuerService,
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

    return this.tokenIssuer.issueTokens(user.id, user.role!);
  }
}
