import { RefreshToken } from '../entities/refresh-token.entity';

export abstract class RefreshTokenRepository {
  abstract create(data: RefreshToken): Promise<void>;
  abstract findByJti(tokenJti: string): Promise<RefreshToken | null>;
  abstract deleteByJti(tokenJti: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
