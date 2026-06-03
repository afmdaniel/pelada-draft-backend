import { Player } from '../../../core/domain/entities/player.entity';

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

  static toSummaryHTTP(player: Player) {
    return {
      name: player.name,
      stars: player.stars,
      position: player.position,
    };
  }
}
