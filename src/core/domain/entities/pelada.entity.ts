import {
  InvalidPeladaCharsError,
  InvalidPeladaNameError,
  MissingOwnerIDError,
} from '../errors';
import { Result } from '../logic/result';
import { Player } from './player.entity';

export interface PeladaProps {
  id?: string;
  name: string;
  ownerId: string;
  players?: Player[];
}

export class Pelada {
  private props: PeladaProps;

  constructor(props: PeladaProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      players: props.players ?? [],
    };
  }

  static create(props: PeladaProps) {
    if (!props.ownerId) {
      return Result.fail(new MissingOwnerIDError());
    }

    if (!props.name || props.name.trim().length < 3) {
      return Result.fail(new InvalidPeladaNameError());
    }

    const nameRegex = /^[a-zA-Z0-9À-ÿ ]+$/;
    if (!nameRegex.test(props.name)) {
      return Result.fail(new InvalidPeladaCharsError());
    }

    return Result.ok(new Pelada(props));
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get players() {
    return this.props.players;
  }
}
