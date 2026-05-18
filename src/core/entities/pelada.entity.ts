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
    this.validate(props);
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      players: props.players ?? [],
    };
  }

  private validate({ name, ownerId }: PeladaProps) {
    if (!name || name.trim().length < 3) {
      throw new Error('O nome da pelada deve ter pelo menos 3 caracteres.');
    }
    if (!ownerId) {
      throw new Error('A pelada deve pertencer a um usuário.');
    }
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
}
