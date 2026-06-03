import { Pelada as PeladaEntity } from '../../../../core/domain/entities/pelada.entity';
import {
  Player as PrismaPlayer,
  Pelada as PrismaPelada,
} from '../../generated/prisma/client';
import { PrismaPlayerMapper } from './prisma-player-mapper';
import { Prisma } from '../../generated/prisma/client';
import { PeladaWithPermissions } from '../../../../core/application/dtos/pelada-with-permissions.dto';
import { PeladaDetails } from '../../../../core/application/dtos/pelada-details.dto';

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

type PrismaPeladaWithDetails = Prisma.PeladaGetPayload<{
  include: {
    owner: { select: { username: true } };
    players: {
      select: { id: true; name: true; stars: true; position: true };
    };
    permissions: {
      select: { privilege: true };
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

  static toDomainWithDetails(raw: PrismaPeladaWithDetails): PeladaDetails {
    return {
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      ownerUsername: raw.owner.username,
      privileges: raw.permissions.map((permission) => permission.privilege),
      players: raw.players.map((player) => ({
        id: player.id,
        name: player.name,
        stars: player.stars,
        position: player.position,
      })),
    };
  }
}
