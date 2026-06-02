import { PlayerPosition } from '../constants/player-position';

export interface PlayerProps {
  id?: string;
  name: string;
  stars: number;
  position?: PlayerPosition;
  peladaId: string;
}

export class Player {
  private props: PlayerProps;

  constructor(props: PlayerProps) {
    this.validate(props);

    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      position: props.position ?? PlayerPosition.GERAL,
    };
  }

  private validate({ name, stars, peladaId }: PlayerProps) {
    if (!peladaId) {
      throw new Error('O jogador deve pertencer a uma pelada.');
    }

    if (!name || name.trim().length < 2) {
      throw new Error('O nome deve ter pelo menos 2 caracteres.');
    }

    if (!Number.isInteger(stars) || stars < 1 || stars > 10) {
      throw new Error(
        'O número de estrelas deve ser um número inteiro entre 1 e 10.',
      );
    }
  }

  // Getters para manter a imutabilidade externa
  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get stars() {
    return this.props.stars;
  }
  get position() {
    return this.props.position;
  }
  get peladaId() {
    return this.props.peladaId;
  }
}
