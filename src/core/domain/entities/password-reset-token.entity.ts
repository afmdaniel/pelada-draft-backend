import { Result } from '../logic/result';
import { MissingTokenDataError, TokenAlreadyExpiredError } from '../errors';

export interface PasswordResetTokenProps {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  usedAt?: Date | null;
}

export class PasswordResetToken {
  private props: PasswordResetTokenProps;

  constructor(props: PasswordResetTokenProps) {
    this.props = props;
  }

  public static create(props: PasswordResetTokenProps) {
    if (!props.tokenHash || !props.userId) {
      return Result.fail(new MissingTokenDataError());
    }

    if (props.expiresAt <= new Date()) {
      return Result.fail(new TokenAlreadyExpiredError());
    }

    return Result.ok(new PasswordResetToken(props));
  }

  get tokenHash() {
    return this.props.tokenHash;
  }
  get userId() {
    return this.props.userId;
  }
  get expiresAt() {
    return this.props.expiresAt;
  }
  get usedAt() {
    return this.props.usedAt ?? null;
  }

  isExpired(now: Date = new Date()) {
    return now > this.expiresAt;
  }

  isUsed() {
    return this.props.usedAt != null;
  }
}
