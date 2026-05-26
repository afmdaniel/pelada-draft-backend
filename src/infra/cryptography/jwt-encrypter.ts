import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encrypter, EncryptOptions } from '../../core/services/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(
    payload: Record<string, unknown>,
    options?: EncryptOptions,
  ): Promise<string> {
    if (options) {
      return this.jwtService.signAsync(payload, {
        secret: options.secret,
        expiresIn: options.expiresIn,
      });
    }

    return this.jwtService.signAsync(payload);
  }

  async decrypt(token: string, secret: string): Promise<Record<string, any>> {
    return this.jwtService.verifyAsync(token, { secret });
  }
}
