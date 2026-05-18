export type GlobalRole = 'ADMIN' | 'USER';

interface UserProps {
  email: string;
  username: string;
  password: string;
  role?: GlobalRole;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = {
      ...props,
      role: props.role ?? 'USER',
    };
  }

  get id() {
    return this._id;
  }
  get email() {
    return this.props.email;
  }
  get username() {
    return this.props.username;
  }
  get password() {
    return this.props.password;
  }
  get role() {
    return this.props.role;
  }

  isAdmin() {
    return this.props.role === 'ADMIN';
  }
}
