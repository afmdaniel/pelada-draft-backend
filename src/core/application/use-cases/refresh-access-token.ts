import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import ms, { StringValue } from 'ms';
import { UserRepository } from '../../domain/repositories/user-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { authConfig } from '../../../infra/config/auth';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';

interface RefreshAccessTokenInput {
  refreshToken: string;
}

@Injectable()
export class RefreshAccessToken {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(input: RefreshAccessTokenInput) {
    try {
      const payload = await this.encrypter.decrypt(
        input.refreshToken,
        authConfig.jwt.refreshTokenSecret!,
      );

      const refreshToken = await this.refreshTokenRepository.findByJti(
        payload.jti as string,
      );
      if (!refreshToken || refreshToken.isExpired()) {
        throw new UnauthorizedException('Refresh token inválido ou expirado.');
      }

      const user = await this.userRepository.findById(payload.sub as string);
      if (!user) throw new UnauthorizedException('Usuário não encontrado.');

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
      const expiresInMs = ms(
        authConfig.jwt.refreshTokenExpiresIn as StringValue,
      );
      const expiresAtDate = new Date(currentTime + expiresInMs);

      const refreshTokenData = new RefreshToken({
        tokenJti: newRefreshTokenJti,
        userId: user.id,
        expiresAt: expiresAtDate,
      });

      await this.refreshTokenRepository.create(refreshTokenData);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }
}
