export interface PeladaProps {
  name: string;
  ownerId: string;
}

export class Pelada {
  private _id: string;
  private props: PeladaProps;

  constructor(props: PeladaProps) {
    this.validate(props);
    this._id = crypto.randomUUID();
    this.props = props;
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
    return this._id;
  }
  get name() {
    return this.props.name;
  }
  get ownerId() {
    return this.props.ownerId;
  }
}
