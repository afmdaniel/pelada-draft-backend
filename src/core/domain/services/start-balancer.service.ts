import { Team } from '../entities/team.entity';
import { PositionLimits } from '../value-objects/position-limits';

export class StarsBalancerService {
  balance(
    teams: Team[],
    limits: PositionLimits,
    withPosition: boolean,
  ): boolean {
    const totals = teams.map((team) => team.totalStars);

    const minStars = Math.min(...totals);
    const maxStars = Math.max(...totals);

    if (maxStars - minStars <= 1) {
      return true;
    }

    const weakestTeamIndex = totals.indexOf(minStars);
    const strongestTeamIndex = totals.indexOf(maxStars);

    return this.tryBalanceTeams(
      teams,
      weakestTeamIndex,
      strongestTeamIndex,
      limits,
      withPosition,
    );
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
