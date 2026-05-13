import { Module } from '@nestjs/common';
import { PeladaController } from './controllers/player/pelada.controller';
import { AddPlayerToPelada } from '../../core/use-cases/add-player-to-pelada';
import { DatabaseModule } from '../database/database.module';
import { GetPlayersByPelada } from '../../core/use-cases/get-player-by-pelada';
import { DrawTeams } from '../../core/use-cases/draw-teams';

@Module({
  imports: [DatabaseModule],
  controllers: [PeladaController],
  providers: [AddPlayerToPelada, GetPlayersByPelada, DrawTeams],
})
export class HttpModule {}
