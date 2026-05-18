import { Module } from '@nestjs/common';
import { PeladaController } from './controllers/pelada.controller';
import { AddPlayerToPelada } from '../../core/use-cases/add-player-to-pelada';
import { DatabaseModule } from '../database/database.module';
import { GetPlayersByPelada } from '../../core/use-cases/get-player-by-pelada';
import { DrawTeams } from '../../core/use-cases/draw-teams';
import { RegisterUser } from '../../core/use-cases/register-user';
import { HashGenerator } from '../../core/services/hash-generator';
import { BcryptGenerator } from '../cryptography/bcrypt-generator';
import { AuthController } from './controllers/auth.controller';
import { AuthenticateUser } from '../../core/use-cases/authenticate-user';
import { JwtModule } from '@nestjs/jwt';
import { Encrypter } from '../../core/services/encrypter';
import { JwtEncrypter } from '../cryptography/jwt-encrypter';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'MUDAR_DEPOIS',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PeladaController, AuthController],
  providers: [
    AddPlayerToPelada,
    GetPlayersByPelada,
    DrawTeams,
    RegisterUser,
    AuthenticateUser,
    {
      provide: HashGenerator,
      useClass: BcryptGenerator,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
})
export class HttpModule {}
