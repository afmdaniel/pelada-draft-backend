import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Você precisará criar este service simples do Nest
import { PeladaRepository } from '../../../../core/repositories/pelada-repository';
import {
  Player,
  PlayerPosition,
} from '../../../../core/entities/player.entity';
import { Pelada } from '../../../../core/entities/pelada.entity';

@Injectable()
export class PrismaPeladaRepository extends PeladaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async addPlayer(player: Player): Promise<void> {
    await this.prisma.player.create({
      data: {
        id: player.id,
        name: player.name,
        stars: player.stars,
        position: player.position ?? 'Geral',
        peladaId: player.peladaId,
      },
    });
  }

  async getPlayersByPelada(peladaId: string): Promise<Player[]> {
    const playersRaw = await this.prisma.player.findMany({
      where: { peladaId },
    });

    return playersRaw.map(
      (p) =>
        new Player({
          id: p.id,
          name: p.name,
          stars: p.stars,
          position: p.position as PlayerPosition,
          peladaId: p.peladaId,
        }),
    );
  }

  async create(pelada: Pelada): Promise<void> {
    await this.prisma.pelada.create({
      data: {
        id: pelada.id,
        name: pelada.name,
        userId: pelada.userId,
      },
    });
  }

  async findById(id: string): Promise<Pelada | null> {
    const peladaRaw = await this.prisma.pelada.findUnique({
      where: { id },
    });

    if (!peladaRaw) {
      return null;
    }

    const players = await this.getPlayersByPelada(id);

    return new Pelada({
      id: peladaRaw.id,
      name: peladaRaw.name,
      userId: peladaRaw.userId,
      players,
    });
  }
}
