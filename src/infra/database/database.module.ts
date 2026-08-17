import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PeladaRepository } from '../../core/domain/repositories/pelada-repository';
import { PrismaPeladaRepository } from './prisma/repositories/prisma-pelada-repository';
import { UserRepository } from '../../core/domain/repositories/user-repository';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { RefreshTokenRepository } from '../../core/domain/repositories/refresh-token-repository';
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token-repository';
import { PasswordResetTokenRepository } from '../../core/domain/repositories/password-reset-token-repository';
import { PrismaPasswordResetTokenRepository } from './prisma/repositories/prisma-password-reset-token-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: PeladaRepository,
      useClass: PrismaPeladaRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: PasswordResetTokenRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
  ],
  exports: [
    PrismaService,
    PeladaRepository,
    UserRepository,
    RefreshTokenRepository,
    PasswordResetTokenRepository,
  ],
})
export class DatabaseModule {}
