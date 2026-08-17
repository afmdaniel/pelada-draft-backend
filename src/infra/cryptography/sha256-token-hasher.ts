import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { TokenHasher } from '../../core/domain/services/token-hasher';

@Injectable()
export class Sha256TokenHasher implements TokenHasher {
  hash(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
