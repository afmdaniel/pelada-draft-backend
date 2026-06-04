import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { Encrypter } from '../../domain/services/encrypter';
import { authConfig } from '../../../infra/config/auth';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';

interface LogoutUserInput {
  refreshToken: string;
}

type LogoutUserOutput = Result<void, AppError>;

@Injectable()
export class LogoutUser {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private encrypter: Encrypter,
  ) {}

  async execute(input: LogoutUserInput): Promise<LogoutUserOutput> {
    try {
      const payload = await this.encrypter.decrypt(
        input.refreshToken,
        authConfig.jwt.refreshTokenSecret as string,
      );

      await this.refreshTokenRepository.deleteByJti(payload.jti as string);

      return Result.ok<void>(undefined);
    } catch {
      // Falha silenciosa por segurança caso o token enviado já seja totalmente inválido
      return Result.ok<void>(undefined);
    }
  }
}
