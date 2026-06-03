import { PlayerPosition } from '../constants/player-position';
import { Team } from '../entities/team.entity';
import { PositionLimits } from '../value-objects/position-limits';

export class PositionBalancerService {
  balance(teams: Team[], limits: PositionLimits): void {
    const MAX_ITERATIONS = 50;

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      const violation = this.findViolation(teams, limits);

      if (!violation) {
        break;
      }

      const swapped = this.fixViolation(
        teams,
        violation.teamIndex,
        violation.position,
        limits,
      );

      if (!swapped) {
        break;
      }
    }
  }

  private findViolation(
    teams: Team[],
    limits: PositionLimits,
  ):
    | {
        teamIndex: number;
        position: PlayerPosition;
      }
    | undefined {
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      const positions = teams[teamIndex].positionsCount;

      for (const position of Object.values(PlayerPosition)) {
        if (positions[position] < limits.getMin(position)) {
          return {
            teamIndex,
            position,
          };
        }
      }
    }

    return undefined;
  }

  private fixViolation(
    teams: Team[],
    receiverTeamIndex: number,
    missingPosition: PlayerPosition,
    limits: PositionLimits,
  ): boolean {
    const receiverTeam = teams[receiverTeamIndex];

    for (
      let donorTeamIndex = 0;
      donorTeamIndex < teams.length;
      donorTeamIndex++
    ) {
      if (donorTeamIndex === receiverTeamIndex) {
        continue;
      }

      const donorTeam = teams[donorTeamIndex];

      const donorPositions = donorTeam.positionsCount;

      if (donorPositions[missingPosition] <= limits.getMin(missingPosition)) {
        continue;
      }

      for (
        let donorPlayerIndex = 0;
        donorPlayerIndex < donorTeam.players.length;
        donorPlayerIndex++
      ) {
        const donorPlayer = donorTeam.players[donorPlayerIndex];

        if (donorPlayer.position !== missingPosition) {
          continue;
        }

        for (
          let receiverPlayerIndex = 0;
          receiverPlayerIndex < receiverTeam.players.length;
          receiverPlayerIndex++
        ) {
          const receiverPlayer = receiverTeam.players[receiverPlayerIndex];

          if (
            receiverPlayer.stars !== donorPlayer.stars ||
            receiverPlayer.position === donorPlayer.position ||
            !receiverPlayer.position
          ) {
            continue;
          }

          receiverTeam.swapPlayerWith(
            receiverPlayerIndex,
            donorTeam,
            donorPlayerIndex,
          );

          if (
            receiverTeam.isInsideLimits(limits) &&
            donorTeam.isInsideLimits(limits)
          ) {
            return true;
          }

          receiverTeam.swapPlayerWith(
            receiverPlayerIndex,
            donorTeam,
            donorPlayerIndex,
          );
        }
      }
    }

    return false;
  }
}
