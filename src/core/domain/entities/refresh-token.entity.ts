import { Result } from '../logic/result';
import { MissingTokenDataError, TokenAlreadyExpiredError } from '../errors';

export interface RefreshTokenProps {
  tokenJti: string;
  userId: string;
  expiresAt: Date;
}

export class RefreshToken {
  private props: RefreshTokenProps;

  constructor(props: RefreshTokenProps) {
    this.props = props;
  }

  public static create(props: RefreshTokenProps) {
    if (!props.tokenJti || !props.userId) {
      return Result.fail(new MissingTokenDataError());
    }

    if (props.expiresAt <= new Date()) {
      return Result.fail(new TokenAlreadyExpiredError());
    }

    return Result.ok(new RefreshToken(props));
  }

  get tokenJti() {
    return this.props.tokenJti;
  }
  get userId() {
    return this.props.userId;
  }
  get expiresAt() {
    return this.props.expiresAt;
  }

  isExpired(now: Date = new Date()) {
    return now > this.expiresAt;
  }
}
