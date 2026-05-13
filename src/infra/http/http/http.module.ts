import { Module } from '@nestjs/common';
import { PlayerController } from '../controllers/player/player.controller';
import { AddPlayerToPelada } from '../../../core/use-cases/add-player-to-pelada';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlayerController],
  providers: [AddPlayerToPelada],
})
export class HttpModule {}
