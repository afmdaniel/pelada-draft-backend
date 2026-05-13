import { Player } from './player.entity';

export interface PeladaProps {
  id?: string;
  name: string;
  userId: string;
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

  private validate({ name, userId }: PeladaProps) {
    if (!name || name.trim().length < 3) {
      throw new Error('O nome da pelada deve ter pelo menos 3 caracteres.');
    }
    if (!userId) {
      throw new Error('A pelada deve pertencer a um usuário.');
    }
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get userId() {
    return this.props.userId;
  }
  get players() {
    return this.props.players;
  }

  public addPlayer(player: Player) {
    if (this.props.players!.length >= 40) {
      throw new Error('Limite de jogadores atingido para esta pelada.');
    }
    this.props.players!.push(player);
  }
}
