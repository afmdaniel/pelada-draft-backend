import { Player as PrismaPlayer } from '../../generated/prisma/client';
import {
  Player as PlayerEntity,
  PlayerPosition,
} from '../../../../core/entities/player.entity';

export class PrismaPlayerMapper {
  static toDomain(raw: PrismaPlayer): PlayerEntity {
    return new PlayerEntity({
      id: raw.id,
      name: raw.name,
      stars: raw.stars,
      position: raw.position as PlayerPosition,
      peladaId: raw.peladaId,
    });
  }

  static toPrisma(player: PlayerEntity) {
    return {
      id: player.id,
      name: player.name,
      stars: player.stars,
      position: player.position ?? 'Geral',
      peladaId: player.peladaId,
    };
  }
}
