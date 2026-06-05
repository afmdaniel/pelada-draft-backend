import { Module } from '@nestjs/common';
import { PeladaController } from './controllers/pelada.controller';
import { AuthController } from './controllers/auth.controller';
import { PeladaPlayerController } from './controllers/pelada-player.controller';
import { PeladaPermissionController } from './controllers/pelada-permission.controller';
import { PeladaDrawController } from './controllers/pelada-draw.controller';
import { ApplicationModule } from '../../core/application/application.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ApplicationModule, DatabaseModule],
  controllers: [
    AuthController,
    PeladaController,
    PeladaPlayerController,
    PeladaDrawController,
    PeladaPermissionController,
  ],
  providers: [],
})
export class HttpModule {}
