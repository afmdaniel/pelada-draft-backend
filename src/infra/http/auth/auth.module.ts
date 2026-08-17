import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashGenerator } from '../../../core/domain/services/hash-generator';
import { BcryptGenerator } from '../../cryptography/bcrypt-generator';
import { Encrypter } from '../../../core/domain/services/encrypter';
import { JwtEncrypter } from '../../cryptography/jwt-encrypter';
import { TokenHasher } from '../../../core/domain/services/token-hasher';
import { Sha256TokenHasher } from '../../cryptography/sha256-token-hasher';
import { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      },
    }),
  ],
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptGenerator,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: TokenHasher,
      useClass: Sha256TokenHasher,
    },
  ],
  exports: [HashGenerator, Encrypter, TokenHasher],
})
export class AuthModule {}
