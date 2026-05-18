import { Pelada } from '../../../core/entities/pelada.entity';

export class PeladaPresenter {
  static toHTTP(pelada: Pelada) {
    return {
      id: pelada.id,
      name: pelada.name,
      ownerId: pelada.ownerId,
    };
  }
}
