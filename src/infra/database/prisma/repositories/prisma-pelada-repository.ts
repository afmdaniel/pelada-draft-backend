import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Você precisará criar este service simples do Nest
import { PeladaRepository } from '../../../../core/repositories/pelada-repository';
import { Player } from '../../../../core/entities/player.entity';
import { Pelada } from '../../../../core/entities/pelada.entity';
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper';
import { PrismaPeladaMapper } from '../mappers/prisma-pelada-mapper';
import {
  PeladaPermission,
  type PeladaPrivilege,
} from '../../../../core/entities/pelada-permission.entity';
import { PrismaPeladaPermissionMapper } from '../mappers/prisma-pelada-permission-mapper';
import { PeladaWithPermissions } from '../../../../core/dtos/pelada-with-permissions.dto';
import { GlobalRole, Prisma } from '../../generated/prisma/client';

@Injectable()
export class PrismaPeladaRepository extends PeladaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async addPlayer(player: Player): Promise<void> {
    const raw = PrismaPlayerMapper.toPrisma(player);

    await this.prisma.player.create({
      data: raw,
    });
  }

  async findManyPlayersByPeladaId(peladaId: string): Promise<Player[]> {
    const playersRaw = await this.prisma.player.findMany({
      where: { peladaId },
    });

    return playersRaw.map((player) => PrismaPlayerMapper.toDomain(player));
  }

  async create(pelada: Pelada): Promise<void> {
    const raw = PrismaPeladaMapper.toPrisma(pelada);

    await this.prisma.pelada.create({
      data: raw,
    });
  }

  async findById(id: string): Promise<Pelada | null> {
    const peladaRaw = await this.prisma.pelada.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!peladaRaw) {
      return null;
    }

    return PrismaPeladaMapper.toDomain(peladaRaw);
  }

  async findManyByUserId(
    userId: string,
    userRole: string,
  ): Promise<PeladaWithPermissions[]> {
    const whereCondition: Prisma.PeladaWhereInput =
      userRole === GlobalRole.ADMIN
        ? {}
        : {
            OR: [
              {
                ownerId: userId,
              },
              {
                permissions: {
                  some: {
                    userId,
                  },
                },
              },
            ],
          };

    const raw = await this.prisma.pelada.findMany({
      where: whereCondition,
      include: {
        owner: {
          select: {
            username: true,
          },
        },
        permissions: {
          where: {
            userId: userId,
          },
          select: {
            privilege: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return raw.map((pelada) =>
      PrismaPeladaMapper.toDomainWithPermissions(pelada),
    );
  }

  async findPermission(
    permission: PeladaPermission,
  ): Promise<PeladaPermission | null> {
    const raw = await this.prisma.peladaPermission.findUnique({
      where: {
        userId_peladaId_privilege: {
          userId: permission.userId,
          peladaId: permission.peladaId,
          privilege: permission.privilege,
        },
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaPeladaPermissionMapper.toDomain(raw);
  }

  async assignPermissions(permissions: PeladaPermission[]): Promise<void> {
    const rawPermissions = permissions.map((permission) =>
      PrismaPeladaPermissionMapper.toPrisma(permission),
    );

    await this.prisma.peladaPermission.createMany({
      data: rawPermissions,
      skipDuplicates: true,
    });
  }

  async revokePermissions(
    userId: string,
    peladaId: string,
    privileges: PeladaPrivilege[],
  ): Promise<void> {
    await this.prisma.peladaPermission.deleteMany({
      where: {
        userId,
        peladaId,
        privilege: { in: privileges },
      },
    });
  }
}
