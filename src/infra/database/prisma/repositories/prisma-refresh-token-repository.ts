import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../../../../core/repositories/refresh-token-repository';
import { RefreshToken } from '../../../../core/entities/refresh-token.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: RefreshToken): Promise<void> {
    await this.prisma.userRefreshToken.create({
      data: {
        tokenJti: data.tokenJti,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByJti(tokenJti: string): Promise<RefreshToken | null> {
    const record = await this.prisma.userRefreshToken.findUnique({
      where: { tokenJti },
    });

    if (!record) return null;

    return new RefreshToken({
      tokenJti: record.tokenJti,
      userId: record.userId,
      expiresAt: record.expiresAt,
    });
  }

  async deleteByJti(tokenJti: string): Promise<void> {
    await this.prisma.userRefreshToken.deleteMany({
      where: { tokenJti },
    });
  }
}
