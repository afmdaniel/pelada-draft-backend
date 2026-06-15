import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashGenerator } from '../../../core/domain/services/hash-generator';
import { BcryptGenerator } from '../../cryptography/bcrypt-generator';
import { Encrypter } from '../../../core/domain/services/encrypter';
import { JwtEncrypter } from '../../cryptography/jwt-encrypter';
import { GoogleStrategy } from './google.strategy';
import { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      },
    }),
  ],
  providers: [
    GoogleStrategy,
    {
      provide: HashGenerator,
      useClass: BcryptGenerator,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [HashGenerator, Encrypter],
})
export class AuthModule {}
