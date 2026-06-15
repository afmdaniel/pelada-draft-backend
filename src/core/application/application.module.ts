import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.molude';
import { DatabaseModule } from '../../infra/database/database.module';
import { CreatePelada } from './use-cases/create-pelada';
import { UpdatePelada } from './use-cases/update-pelada';
import { DeletePelada } from './use-cases/detele-pelada';
import { AddPlayerToPelada } from './use-cases/add-player-to-pelada';
import { GetPlayersByPelada } from './use-cases/get-player-by-pelada';
import { DrawTeams } from './use-cases/draw-teams';
import { RegisterUser } from './use-cases/register-user';
import { AuthenticateUser } from './use-cases/authenticate-user';
import { ChangePassword } from './use-cases/change-password';
import { RefreshAccessToken } from './use-cases/refresh-access-token';
import { LogoutUser } from './use-cases/logout-user';
import { ManagePeladaPermission } from './use-cases/manage-pelada-permission';
import { FetchUserPeladas } from './use-cases/fetch-user-peladas';
import { GetPeladaById } from './use-cases/get-pelada-by-id';
import { UpdatePlayer } from './use-cases/update-player';
import { DeletePlayer } from './use-cases/delete-player';
import { AuthModule } from '../../infra/http/auth/auth.module';
import { FetchPeladaUsers } from './use-cases/fetch-pelada-users';
import { GoogleAuthenticateUser } from './use-cases/google-authenticate-user';
import { TokenIssuerService } from './services/token-issuer.service';

@Module({
  imports: [DomainModule, DatabaseModule, AuthModule],
  providers: [
    TokenIssuerService,

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
    GoogleAuthenticateUser,

    ManagePeladaPermission,
    FetchPeladaUsers,
    FetchUserPeladas,
    GetPeladaById,

    UpdatePlayer,
    DeletePlayer,
  ],
  exports: [
    TokenIssuerService,

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
    GoogleAuthenticateUser,

    ManagePeladaPermission,
    FetchPeladaUsers,
    FetchUserPeladas,
    GetPeladaById,

    UpdatePlayer,
    DeletePlayer,
  ],
})
export class ApplicationModule {}
