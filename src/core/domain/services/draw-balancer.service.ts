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
    let bestDiff = Number.MAX_SAFE_INTEGER;
    let bestPositionsValid = false;
    const MAX_ATTEMPTS = 100;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const teams = this.draftService.execute(
        completePlayers,
        context.numberOfTeams,
        context.withPosition,
      );

      if (context.withPosition) {
        this.positionBalancer.balance(teams, limits);
      }

      const starsBalanced = this.starsBalancer.balance(
        teams,
        limits,
        context.withPosition,
      );

      const positionsValid =
        !context.withPosition ||
        teams.every((team) => team.isInsideLimits(limits));

      if (starsBalanced && positionsValid) {
        return teams;
      }

      const totals = teams.map((team) => team.totalStars);
      const diff = Math.max(...totals) - Math.min(...totals);

      if (
        bestTeams.length === 0 ||
        (positionsValid && !bestPositionsValid) ||
        (positionsValid === bestPositionsValid && diff < bestDiff)
      ) {
        bestTeams = teams;
        bestDiff = diff;
        bestPositionsValid = positionsValid;
      }
    }

    return bestTeams;
  }
}
