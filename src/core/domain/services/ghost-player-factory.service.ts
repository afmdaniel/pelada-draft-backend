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

    const ghosts: Player[] = [];

    for (let index = 0; index < missingCount; index++) {
      const playerOrError = Player.create({
        name: `Ghost ${index + 1}`,
        stars,
        peladaId,
        position: PlayerPosition.GERAL,
      });

      if (playerOrError.isFailure) {
        throw new Error(
          `Falha crítica ao gerar fantasma: ${playerOrError.error.message}`,
        );
      }

      ghosts.push(playerOrError.value);
    }

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
