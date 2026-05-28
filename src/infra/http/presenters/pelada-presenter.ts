import { PeladaWithPermissions } from '../../../core/dtos/pelada-with-permissions.dto';
import { Pelada } from '../../../core/entities/pelada.entity';

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
}
