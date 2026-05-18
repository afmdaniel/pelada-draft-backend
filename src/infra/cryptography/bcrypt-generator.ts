// src/infra/cryptography/bcrypt-generator.ts
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../../core/services/hash-generator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptGenerator implements HashGenerator {
  private readonly SALT_ROUNDS = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
