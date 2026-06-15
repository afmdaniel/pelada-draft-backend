import {
  InvalidEmailError,
  InvalidUsernameError,
  WeakPasswordError,
} from '../errors';
import { Result } from '../logic/result';

export type GlobalRole = 'ADMIN' | 'USER';
export type AuthProvider = 'LOCAL' | 'GOOGLE';

interface UserProps {
  email: string;
  username: string;
  password?: string | null;
  googleId?: string | null;
  authProvider?: AuthProvider;
  role?: GlobalRole;
}

export class User {
  private _id: string;
  private props: Required<UserProps>;

  constructor(props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = {
      ...props,
      password: props.password ?? null,
      googleId: props.googleId ?? null,
      authProvider: props.authProvider ?? 'LOCAL',
      role: props.role ?? 'USER',
    };
  }

  public static create(props: UserProps, id?: string) {
    if (!props.email || !props.email.includes('@')) {
      return Result.fail(new InvalidEmailError());
    }

    const authProvider = props.authProvider ?? 'LOCAL';

    if (authProvider === 'LOCAL') {
      if (!props.password || props.password.length < 6) {
        return Result.fail(new WeakPasswordError());
      }
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!props.username || !usernameRegex.test(props.username)) {
      return Result.fail(new InvalidUsernameError());
    }

    return Result.ok(new User(props, id));
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
  get googleId() {
    return this.props.googleId;
  }
  get authProvider() {
    return this.props.authProvider;
  }
  get role() {
    return this.props.role;
  }

  isAdmin() {
    return this.props.role === 'ADMIN';
  }
}
