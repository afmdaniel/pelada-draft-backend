import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Você precisará criar este service simples do Nest
import { PeladaRepository } from '../../../../core/repositories/pelada-repository';
import { Player } from '../../../../core/entities/player.entity';
import { Pelada } from '../../../../core/entities/pelada.entity';
import { PrismaPlayerMapper } from '../mappers/prisma-player-mapper';

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
    await this.prisma.pelada.create({
      data: {
        id: pelada.id,
        name: pelada.name,
        ownerId: pelada.ownerId,
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

    const players = await this.findManyPlayersByPeladaId(id);

    return new Pelada({
      id: peladaRaw.id,
      name: peladaRaw.name,
      ownerId: peladaRaw.ownerId,
      players,
    });
  }
}
