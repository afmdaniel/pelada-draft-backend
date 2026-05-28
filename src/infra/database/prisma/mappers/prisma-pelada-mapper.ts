import { Pelada as PeladaEntity } from '../../../../core/entities/pelada.entity';
import {
  Player as PrismaPlayer,
  Pelada as PrismaPelada,
} from '../../generated/prisma/client';
import { PrismaPlayerMapper } from './prisma-player-mapper';
import { Prisma } from '../../generated/prisma/client';
import { PeladaWithPermissions } from '../../../../core/dtos/pelada-with-permissions.dto';

type PrismaPeladaWithPlayers = PrismaPelada & { players?: PrismaPlayer[] };

type PrismaPeladaWithPermissions = Prisma.PeladaGetPayload<{
  include: {
    owner: {
      select: {
        username: true;
      };
    };
    permissions: {
      select: {
        privilege: true;
      };
    };
  };
}>;

export class PrismaPeladaMapper {
  static toDomain(raw: PrismaPeladaWithPlayers): PeladaEntity {
    return new PeladaEntity({
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      players:
        raw.players?.map((player) => PrismaPlayerMapper.toDomain(player)) ?? [],
    });
  }

  static toPrisma(pelada: PeladaEntity) {
    return {
      id: pelada.id,
      name: pelada.name,
      ownerId: pelada.ownerId,
    };
  }

  static toDomainWithPermissions(
    raw: PrismaPeladaWithPermissions,
  ): PeladaWithPermissions {
    return {
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      ownerUsername: raw.owner.username,
      privileges: raw.permissions.map((permission) => permission.privilege),
    };
  }
}
