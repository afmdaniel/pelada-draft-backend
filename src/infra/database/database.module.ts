import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PeladaRepository } from '../../core/repositories/pelada-repository';
import { PrismaPeladaRepository } from './prisma/repositories/prisma-pelada-repository';
import { UserRepository } from '../../core/repositories/user-repository';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PeladaRepository,
      useClass: PrismaPeladaRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PeladaRepository, UserRepository],
})
export class DatabaseModule {}
