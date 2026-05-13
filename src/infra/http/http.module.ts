import { Module } from '@nestjs/common';
import { PeladaController } from './controllers/player/player.controller';
import { AddPlayerToPelada } from '../../core/use-cases/add-player-to-pelada';
import { DatabaseModule } from '../database/database.module';
import { GetPlayersByPelada } from '../../core/use-cases/get-player-by-pelada';

@Module({
  imports: [DatabaseModule],
  controllers: [PeladaController],
  providers: [AddPlayerToPelada, GetPlayersByPelada],
})
export class HttpModule {}
