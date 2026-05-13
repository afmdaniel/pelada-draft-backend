import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PeladaRepository } from '../../core/repositories/pelada-repository';
import { PrismaPeladaRepository } from './prisma/repositories/prisma-pelada-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PeladaRepository,
      useClass: PrismaPeladaRepository,
    },
  ],
  exports: [PeladaRepository],
})
export class DatabaseModule {}
