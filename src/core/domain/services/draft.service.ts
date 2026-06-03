import { PlayerPosition } from '../constants/player-position';
import { Player } from '../entities/player.entity';
import { Team } from '../entities/team.entity';

type PositionCounter = Record<PlayerPosition, number>;

export class DraftService {
  private readonly POSITIONS = Object.values(
    PlayerPosition,
  ) as PlayerPosition[];

  execute(
    players: Player[],
    numberOfTeams: number,
    withPosition: boolean,
  ): Team[] {
    const sortedPlayers = [...players]
      .map((player) => ({
        player,
        randomizedScore: player.stars + (Math.random() * 0.98 + 0.01),
      }))
      .sort((a, b) => b.randomizedScore - a.randomizedScore)
      .map(({ player }) => player);

    const teams: Team[] = Array.from(
      { length: numberOfTeams },
      () => new Team(),
    );

    const teamScores = new Array<number>(numberOfTeams).fill(0);
    const teamPositions: PositionCounter[] = Array.from(
      { length: numberOfTeams },
      () => this.getEmptyPositionCounter(),
    );

    const positionWeight = withPosition ? 2 : 0;

    for (const player of sortedPlayers) {
      const selectedTeamIndex = this.findBestTeam(
        player,
        teamScores,
        teamPositions,
        positionWeight,
      );

      teams[selectedTeamIndex].addPlayer(player);
      teamScores[selectedTeamIndex] += player.stars;

      if (player.position) {
        teamPositions[selectedTeamIndex][player.position]++;
      }
    }

    return teams;
  }

  private findBestTeam(
    player: Player,
    teamScores: number[],
    teamPositions: PositionCounter[],
    positionWeight: number,
  ): number {
    let bestTeamIndex = 0;
    let bestScore = Number.MAX_SAFE_INTEGER;

    let averagePositionCount = 0;
    if (positionWeight > 0 && player.position) {
      let totalPosition = 0;

      for (let i = 0; i < teamPositions.length; i++) {
        totalPosition += teamPositions[i][player.position];
      }

      averagePositionCount = totalPosition / teamPositions.length;
    }

    for (let i = 0; i < teamScores.length; i++) {
      let positionPenalty = 0;

      if (positionWeight > 0 && player.position) {
        const excess = teamPositions[i][player.position] - averagePositionCount;

        if (excess > 0) {
          positionPenalty = excess * positionWeight;
        }
      }

      const effectiveScore = teamScores[i] + positionPenalty;

      if (effectiveScore < bestScore) {
        bestScore = effectiveScore;
        bestTeamIndex = i;
      }
    }

    return bestTeamIndex;
  }

  private getEmptyPositionCounter(): PositionCounter {
    return this.POSITIONS.reduce((acc, pos) => {
      acc[pos] = 0;
      return acc;
    }, {} as PositionCounter);
  }
}
