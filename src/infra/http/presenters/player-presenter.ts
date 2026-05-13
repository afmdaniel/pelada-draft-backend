// src/infra/http/presenters/player-presenter.ts
import { Player } from '../../../core/entities/player.entity';

export class PlayerPresenter {
  static toHTTP(player: Player) {
    return {
      id: player.id,
      name: player.name,
      stars: player.stars,
      position: player.position,
      peladaId: player.peladaId,
    };
  }
}
