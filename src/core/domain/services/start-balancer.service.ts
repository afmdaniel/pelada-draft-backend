import { Team } from '../entities/team.entity';
import { PositionLimits } from '../value-objects/position-limits';

export class StarsBalancerService {
  balance(
    teams: Team[],
    limits: PositionLimits,
    withPosition: boolean,
  ): boolean {
    const MAX_ITERATIONS = 50;

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      const totals = teams.map((team) => team.totalStars);

      if (Math.max(...totals) - Math.min(...totals) <= 1) {
        return true;
      }

      const pairs = this.buildCandidatePairs(totals);

      const improved = pairs.some(({ weakIndex, strongIndex }) =>
        this.tryBalanceTeams(
          teams,
          weakIndex,
          strongIndex,
          limits,
          withPosition,
        ),
      );

      if (!improved) {
        break;
      }
    }

    const finalTotals = teams.map((team) => team.totalStars);

    return Math.max(...finalTotals) - Math.min(...finalTotals) <= 1;
  }

  private buildCandidatePairs(
    totals: number[],
  ): Array<{ weakIndex: number; strongIndex: number; delta: number }> {
    const pairs: Array<{
      weakIndex: number;
      strongIndex: number;
      delta: number;
    }> = [];

    for (let weakIndex = 0; weakIndex < totals.length; weakIndex++) {
      for (let strongIndex = 0; strongIndex < totals.length; strongIndex++) {
        const delta = totals[strongIndex] - totals[weakIndex];

        if (delta > 1) {
          pairs.push({ weakIndex, strongIndex, delta });
        }
      }
    }

    return pairs.sort((a, b) => b.delta - a.delta);
  }

  private tryBalanceTeams(
    teams: Team[],
    weakestTeamIndex: number,
    strongestTeamIndex: number,
    limits: PositionLimits,
    withPosition: boolean,
  ): boolean {
    const weakTeam = teams[weakestTeamIndex];

    const strongTeam = teams[strongestTeamIndex];

    const candidates: Array<{
      weakIndex: number;
      strongIndex: number;
      delta: number;
    }> = [];

    for (let weakIndex = 0; weakIndex < weakTeam.players.length; weakIndex++) {
      const weakPlayer = weakTeam.players[weakIndex];

      for (
        let strongIndex = 0;
        strongIndex < strongTeam.players.length;
        strongIndex++
      ) {
        const strongPlayer = strongTeam.players[strongIndex];

        if (strongPlayer.stars <= weakPlayer.stars) {
          continue;
        }

        candidates.push({
          weakIndex,
          strongIndex,
          delta: strongPlayer.stars - weakPlayer.stars,
        });
      }
    }

    candidates.sort((a, b) => a.delta - b.delta);

    for (const { weakIndex, strongIndex } of candidates) {
      weakTeam.swapPlayerWith(weakIndex, strongTeam, strongIndex);

      const valid =
        !withPosition ||
        (weakTeam.isInsideLimits(limits) && strongTeam.isInsideLimits(limits));

      if (valid) {
        const weakStars = weakTeam.totalStars;

        const strongStars = strongTeam.totalStars;

        const diff = Math.abs(strongStars - weakStars);

        if (diff <= 1) {
          return true;
        }
      }

      weakTeam.swapPlayerWith(weakIndex, strongTeam, strongIndex);
    }

    return false;
  }
}
