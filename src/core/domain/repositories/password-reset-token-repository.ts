import { PasswordResetToken } from '../entities/password-reset-token.entity';

export abstract class PasswordResetTokenRepository {
  abstract create(data: PasswordResetToken): Promise<void>;
  abstract findByTokenHash(
    tokenHash: string,
  ): Promise<PasswordResetToken | null>;
  abstract markAsUsed(tokenHash: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
