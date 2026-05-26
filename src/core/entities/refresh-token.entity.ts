export interface RefreshTokenProps {
  tokenJti: string;
  userId: string;
  expiresAt: Date;
}

export class RefreshToken {
  private refreshTokenProps: RefreshTokenProps;

  constructor(props: RefreshTokenProps) {
    this.refreshTokenProps = props;
  }

  get tokenJti() {
    return this.refreshTokenProps.tokenJti;
  }
  get userId() {
    return this.refreshTokenProps.userId;
  }
  get expiresAt() {
    return this.refreshTokenProps.expiresAt;
  }

  isExpired(now: Date = new Date()) {
    return now > this.expiresAt;
  }
}
