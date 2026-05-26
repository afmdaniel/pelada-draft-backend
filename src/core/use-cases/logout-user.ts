import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token-repository';
import { Encrypter } from '../services/encrypter';
import { authConfig } from '../../infra/config/auth';

interface LogoutUserInput {
  refreshToken: string;
}

@Injectable()
export class LogoutUser {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(input: LogoutUserInput): Promise<void> {
    try {
      const payload = await this.encrypter.decrypt(
        input.refreshToken,
        authConfig.jwt.refreshTokenSecret as string,
      );

      await this.refreshTokenRepository.deleteByJti(payload.jti as string);
    } catch {
      // Falha silenciosa por segurança caso o token enviado já seja totalmente inválido
      return;
    }
  }
}
