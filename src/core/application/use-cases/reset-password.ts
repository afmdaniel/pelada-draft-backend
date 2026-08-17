import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token-repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository';
import { TokenHasher } from '../../domain/services/token-hasher';
import { HashGenerator } from '../../domain/services/hash-generator';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import {
  ExpiredResetTokenError,
  InvalidResetTokenError,
  ResetTokenAlreadyUsedError,
} from '../../domain/errors';

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

type ResetPasswordOutput = Result<void, AppError>;

@Injectable()
export class ResetPassword {
  constructor(
    private userRepository: UserRepository,
    private passwordResetTokenRepository: PasswordResetTokenRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private tokenHasher: TokenHasher,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const tokenHash = this.tokenHasher.hash(input.token);
    const resetToken =
      await this.passwordResetTokenRepository.findByTokenHash(tokenHash);

    if (!resetToken) {
      return Result.fail(new InvalidResetTokenError());
    }

    if (resetToken.isUsed()) {
      return Result.fail(new ResetTokenAlreadyUsedError());
    }

    if (resetToken.isExpired()) {
      return Result.fail(new ExpiredResetTokenError());
    }

    const hashedPassword = await this.hashGenerator.hash(input.newPassword);

    await this.userRepository.updatePassword(resetToken.userId, hashedPassword);
    await this.passwordResetTokenRepository.markAsUsed(tokenHash);
    await this.refreshTokenRepository.deleteByUserId(resetToken.userId);

    return Result.ok(undefined);
  }
}
