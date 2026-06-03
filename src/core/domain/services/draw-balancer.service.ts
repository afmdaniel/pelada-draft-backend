import { Team } from '../entities/team.entity';
import { DraftService } from './draft.service';
import { StarsBalancerService } from './start-balancer.service';
import { PositionBalancerService } from './position-balancer.service';
import { DrawContext } from '../value-objects/draw-context';
import { GhostPlayerFactory } from './ghost-player-factory.service';
import { PositionLimitCalculator } from './position-limit-calculator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrawBalancerService {
  constructor(
    private readonly draftService: DraftService,
    private readonly starsBalancer: StarsBalancerService,
    private readonly positionBalancer: PositionBalancerService,
  ) {}

  draw(context: DrawContext): Team[] {
    const completePlayers = GhostPlayerFactory.completePlayers(
      context.peladaId,
      context.players,
      context.numberOfTeams,
    );

    const limits = PositionLimitCalculator.calculate(
      completePlayers,
      context.numberOfTeams,
    );

    let bestTeams: Team[] = [];

    for (let attempt = 0; attempt < 10; attempt++) {
      const teams = this.draftService.execute(
        completePlayers,
        context.numberOfTeams,
        context.withPosition,
      );

      if (context.withPosition) {
        this.positionBalancer.balance(teams, limits);
      }

      const starsBalanced = this.starsBalancer.balance(teams, limits);

      const positionsValid =
        !context.withPosition ||
        teams.every((team) => team.isInsideLimits(limits));

      bestTeams = teams;

      if (starsBalanced && positionsValid) {
        return teams;
      }
    }

    return bestTeams;
  }
}
