import { PlayerPosition } from '../constants/player-position';
import {
  InvalidPlayerNameError,
  InvalidStarsError,
  MissingPeladaIdError,
} from '../errors';
import { Result } from '../logic/result';

export interface PlayerProps {
  id?: string;
  name: string;
  stars: number;
  position?: PlayerPosition;
  peladaId: string;
}

export class Player {
  private props: PlayerProps;

  private constructor(props: PlayerProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      position: props.position ?? PlayerPosition.GERAL,
    };
  }

  static create(props: PlayerProps) {
    if (!props.peladaId) {
      return Result.fail(new MissingPeladaIdError());
    }

    if (!props.name || props.name.trim().length < 2) {
      return Result.fail(new InvalidPlayerNameError());
    }

    if (!Number.isInteger(props.stars) || props.stars < 1 || props.stars > 10) {
      return Result.fail(new InvalidStarsError());
    }

    return Result.ok(new Player(props));
  }

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
