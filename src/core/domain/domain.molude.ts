import { Module } from '@nestjs/common';
import { DrawBalancerService } from './services/draw-balancer.service';
import { DraftService } from './services/draft.service';
import { StarsBalancerService } from './services/start-balancer.service';
import { PositionBalancerService } from './services/position-balancer.service';

@Module({
  providers: [
    DrawBalancerService,
    DraftService,
    StarsBalancerService,
    PositionBalancerService,
  ],
  exports: [DrawBalancerService],
})
export class DomainModule {}
