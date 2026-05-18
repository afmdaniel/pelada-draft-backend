import { Module } from '@nestjs/common';
import { PeladaController } from './controllers/player/pelada.controller';
import { AddPlayerToPelada } from '../../core/use-cases/add-player-to-pelada';
import { DatabaseModule } from '../database/database.module';
import { GetPlayersByPelada } from '../../core/use-cases/get-player-by-pelada';
import { DrawTeams } from '../../core/use-cases/draw-teams';
import { RegisterUser } from '../../core/use-cases/register-user';
import { HashGenerator } from '../../core/services/hash-generator';
import { BcryptGenerator } from '../cryptography/bcrypt-generator';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PeladaController, AuthController],
  providers: [
    AddPlayerToPelada,
    GetPlayersByPelada,
    DrawTeams,
    RegisterUser,
    {
      provide: HashGenerator,
      useClass: BcryptGenerator,
    },
  ],
})
export class HttpModule {}
