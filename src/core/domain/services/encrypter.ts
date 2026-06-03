import { JwtSignOptions } from '@nestjs/jwt';

export interface EncryptOptions {
  secret: string;
  expiresIn: JwtSignOptions['expiresIn'];
}

export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: EncryptOptions,
  ): Promise<string>;

  abstract decrypt(token: string, secret: string): Promise<Record<string, any>>;
}
