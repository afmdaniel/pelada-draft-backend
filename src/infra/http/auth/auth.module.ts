import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashGenerator } from '../../../core/domain/services/hash-generator';
import { BcryptGenerator } from '../../cryptography/bcrypt-generator';
import { Encrypter } from '../../../core/domain/services/encrypter';
import { JwtEncrypter } from '../../cryptography/jwt-encrypter';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
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
  ],
  exports: [HashGenerator, Encrypter],
})
export class AuthModule {}
