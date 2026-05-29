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
import { CreatePelada } from '../../core/use-cases/create-pelada';
import { ChangePassword } from '../../core/use-cases/change-password';
import { RefreshAccessToken } from '../../core/use-cases/refresh-access-token';
import { LogoutUser } from '../../core/use-cases/logout-user';
import { ManagePeladaPermission } from '../../core/use-cases/manage-pelada-permission';
import { FetchUserPeladas } from '../../core/use-cases/fetch-user-peladas';
import { GetPeladaById } from '../../core/use-cases/get-pelada-by-id';
import { UpdatePelada } from '../../core/use-cases/update-pelada';
import { DeletePelada } from '../../core/use-cases/detele-pelada';
import { UpdatePlayer } from '../../core/use-cases/update-player';
import { DeletePlayer } from '../../core/use-cases/delete-player';

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
    CreatePelada,
    UpdatePelada,
    DeletePelada,
    AddPlayerToPelada,
    GetPlayersByPelada,
    DrawTeams,
    RegisterUser,
    AuthenticateUser,
    ChangePassword,
    RefreshAccessToken,
    LogoutUser,
    ManagePeladaPermission,
    FetchUserPeladas,
    GetPeladaById,
    UpdatePlayer,
    DeletePlayer,
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
