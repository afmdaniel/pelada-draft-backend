// src/infra/database/prisma/repositories/prisma-user-repository.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { User } from '../../../../core/entities/user.entity';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    return PrismaUserMapper.toDomain(user);
  }
}
