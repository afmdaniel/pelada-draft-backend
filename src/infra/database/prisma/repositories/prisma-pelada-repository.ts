import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PeladaRepository } from '../../../../core/domain/repositories/pelada-repository';
import { Player } from '../../../../core/domain/entities/player.entity';
import { Pelada } from '../../../../core/domain/entities/pelada.entity';
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper';
import { PrismaPeladaMapper } from '../mappers/prisma-pelada-mapper';
import {
  PeladaPermission,
  type PeladaPrivilege,
} from '../../../../core/domain/entities/pelada-permission.entity';
import { PrismaPeladaPermissionMapper } from '../mappers/prisma-pelada-permission-mapper';
import { PeladaWithPermissions } from '../../../../core/application/dtos/pelada-with-permissions.dto';
import { GlobalRole, Prisma } from '../../generated/prisma/client';
import { PeladaDetails } from '../../../../core/application/dtos/pelada-details.dto';

@Injectable()
export class PrismaPeladaRepository extends PeladaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(pelada: Pelada): Promise<void> {
    const raw = PrismaPeladaMapper.toPrisma(pelada);

    await this.prisma.pelada.create({
      data: raw,
    });
  }

  async update(pelada: Pelada): Promise<void> {
    const raw = PrismaPeladaMapper.toPrisma(pelada);

    await this.prisma.pelada.update({
      where: { id: pelada.id! },
      data: {
        name: raw.name,
      },
    });
  }

  async delete(peladaId: string): Promise<void> {
    await this.prisma.pelada.delete({
      where: { id: peladaId },
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

  async addPlayer(player: Player): Promise<void> {
    const raw = PrismaPlayerMapper.toPrisma(player);

    await this.prisma.player.create({
      data: raw,
    });
  }

  async findManyPlayersByPeladaId(peladaId: string): Promise<Player[]> {
    const playersRaw = await this.prisma.player.findMany({
      where: { peladaId },
      orderBy: { name: 'asc' },
    });

    return playersRaw.map((player) => PrismaPlayerMapper.toDomain(player));
  }

  async findPlayerById(playerId: string): Promise<Player | null> {
    const raw = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!raw) {
      return null;
    }

    return PrismaPlayerMapper.toDomain(raw);
  }

  async findPlayerByNameAndPeladaId(
    name: string,
    peladaId: string,
  ): Promise<Player | null> {
    const raw = await this.prisma.player.findUnique({
      where: { peladaId_name: { name, peladaId } },
    });

    if (!raw) {
      return null;
    }

    return PrismaPlayerMapper.toDomain(raw);
  }

  async updatePlayer(player: Player): Promise<void> {
    const raw = PrismaPlayerMapper.toPrisma(player);

    await this.prisma.player.update({
      where: { id: player.id! },
      data: raw,
    });
  }

  async deletePlayer(playerId: string): Promise<void> {
    await this.prisma.player.delete({
      where: { id: playerId },
    });
  }

  async findDetailsById(
    peladaId: string,
    currentUserId: string,
  ): Promise<PeladaDetails | null> {
    const raw = await this.prisma.pelada.findUnique({
      where: { id: peladaId },
      include: {
        owner: { select: { username: true } },
        players: {
          select: { id: true, name: true, stars: true, position: true },
          orderBy: { name: 'asc' },
        },
        permissions: {
          where: { userId: currentUserId },
          select: { privilege: true },
        },
      },
    });

    if (!raw) return null;

    return PrismaPeladaMapper.toDomainWithDetails(raw);
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
