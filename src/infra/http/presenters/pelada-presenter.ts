import { PeladaDetails } from '../../../core/dtos/pelada-details.dto';
import { PeladaWithPermissions } from '../../../core/dtos/pelada-with-permissions.dto';
import { Pelada } from '../../../core/entities/pelada.entity';
import { Player } from '../../../core/entities/player.entity';
import { PlayerPresenter } from './player-presenter';

export class PeladaPresenter {
  static toHTTP(pelada: Pelada) {
    return {
      id: pelada.id,
      name: pelada.name,
      ownerId: pelada.ownerId,
    };
  }

  static toHTTPWithPermissions(pelada: PeladaWithPermissions) {
    return {
      id: pelada.id,
      name: pelada.name,
      ownerUsername: pelada.ownerUsername,
      privileges: pelada.privileges,
    };
  }

  static toHTTPWithDetails(pelada: PeladaDetails) {
    return {
      id: pelada.id,
      name: pelada.name,
      ownerUsername: pelada.ownerUsername,
      privileges: pelada.privileges,
      players: pelada.players.map((player) =>
        PlayerPresenter.toSummaryHTTP(player as Player),
      ),
    };
  }
}
