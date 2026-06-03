import { Player } from '../entities/player.entity';
import { PlayerPosition } from '../constants/player-position';

export class GhostPlayerFactory {
  static completePlayers(
    peladaId: string,
    players: Player[],
    numberOfTeams: number,
  ): Player[] {
    const remainder = players.length % numberOfTeams;

    if (remainder === 0) {
      return players;
    }

    const missingCount = numberOfTeams - remainder;

    const stars = this.getMostFrequentStars(players);

    const ghosts = Array.from(
      { length: missingCount },
      (_, index) =>
        new Player({
          name: `Ghost ${index + 1}`,
          stars,
          peladaId,
          position: PlayerPosition.GERAL,
        }),
    );

    return [...players, ...ghosts];
  }

  private static getMostFrequentStars(players: Player[]): number {
    const frequency = new Map<number, number>();

    let mostFrequent = 0;
    let highestCount = 0;

    for (const player of players) {
      const count = (frequency.get(player.stars) ?? 0) + 1;

      frequency.set(player.stars, count);

      if (count > highestCount) {
        highestCount = count;
        mostFrequent = player.stars;
      }
    }

    return mostFrequent;
  }
}
