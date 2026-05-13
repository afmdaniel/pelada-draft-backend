import { Controller, Post, Body } from '@nestjs/common';
import { AddPlayerToPelada } from '../../../../core/use-cases/add-player-to-pelada';
import { CreatePlayerBody } from '../../dtos/create-player-body';

@Controller('players')
export class PlayerController {
  constructor(private addPlayerToPelada: AddPlayerToPelada) {}

  @Post()
  async create(@Body() body: CreatePlayerBody) {
    const { name, stars, position, peladaId } = body;

    const player = await this.addPlayerToPelada.execute({
      name,
      stars,
      position,
      peladaId,
    });

    return {
      player: {
        id: player.id,
        name: player.name,
        stars: player.stars,
      },
    };
  }
}
