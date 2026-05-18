import { Pelada as PeladaEntity } from '../../../../core/entities/pelada.entity';
import {
  Player as PrismaPlayer,
  Pelada as PrismaPelada,
} from '../../generated/prisma/client';
import { PrismaPlayerMapper } from './prisma-player-mapper';

type PrismaPeladaWithPlayers = PrismaPelada & { players?: PrismaPlayer[] };

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
}
