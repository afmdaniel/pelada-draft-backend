import { Injectable } from '@nestjs/common';
import { PasswordResetTokenRepository } from '../../../../core/domain/repositories/password-reset-token-repository';
import { PasswordResetToken } from '../../../../core/domain/entities/password-reset-token.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: PasswordResetToken): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record) return null;

    return new PasswordResetToken({
      tokenHash: record.tokenHash,
      userId: record.userId,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
    });
  }

  async markAsUsed(tokenHash: string): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
