import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';
import { UserRepository } from '../../domain/repositories/user-repository';
import { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token-repository';
import { TokenHasher } from '../../domain/services/token-hasher';
import { MailSender } from '../../domain/services/mail-sender';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';
import { Result } from '../../domain/logic/result';
import { AppError } from '../../domain/errors/app-error';
import { mailConfig } from '../../../infra/config/mail';

interface RequestPasswordResetInput {
  email: string;
}

type RequestPasswordResetOutput = Result<void, AppError>;

@Injectable()
export class RequestPasswordReset {
  constructor(
    private userRepository: UserRepository,
    private passwordResetTokenRepository: PasswordResetTokenRepository,
    private tokenHasher: TokenHasher,
    private mailSender: MailSender,
  ) {}

  async execute(
    input: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      // Falha silenciosa por segurança: evita enumeração de e-mails cadastrados
      return Result.ok(undefined);
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.tokenHasher.hash(rawToken);
    const expiresInMs = ms(
      mailConfig.passwordReset.tokenExpiresIn as StringValue,
    );
    const expiresAt = new Date(Date.now() + expiresInMs);

    const resetTokenOrError = PasswordResetToken.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    if (resetTokenOrError.isFailure) {
      return Result.ok(undefined);
    }

    await this.passwordResetTokenRepository.deleteByUserId(user.id);
    await this.passwordResetTokenRepository.create(resetTokenOrError.value);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await this.mailSender.sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      expiresInMinutes: expiresInMs / 60000,
    });

    return Result.ok(undefined);
  }
}
