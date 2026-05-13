import { Player } from '../entities/player.entity';

export class DrawBalancerService {
  static draw(players: Player[], numberOfTeams: number): Player[][] {
    const completePlayers = this.fillWithGhostPlayers(players, numberOfTeams);

    const sortedPlayers = completePlayers
      .map((player) => ({
        player,
        randomizedScore: player.stars + (Math.random() * (0.99 - 0.01) + 0.01),
      }))
      .sort((a, b) => b.randomizedScore - a.randomizedScore)
      .map((item) => item.player);

    const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
    const teamScores = Array(numberOfTeams).fill(0);

    sortedPlayers.forEach((player) => {
      const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));

      teams[minScoreIndex].push(player);
      teamScores[minScoreIndex] += player.stars;
    });

    return teams;
  }

  private static getMostFrequentStars(players: Player[]): number {
    const frequency = new Map<number, number>();

    players.forEach((player) => {
      frequency.set(player.stars, (frequency.get(player.stars) || 0) + 1);
    });

    let mostFrequent = players[0]?.stars ?? 0;
    let highestCount = 0;

    frequency.forEach((count, stars) => {
      if (count > highestCount) {
        highestCount = count;
        mostFrequent = stars;
      }
    });

    return mostFrequent;
  }

  private static fillWithGhostPlayers(
    players: Player[],
    numberOfTeams: number,
  ): Player[] {
    const remainder = players.length % numberOfTeams;

    if (remainder === 0) return players;

    const missingPlayers = numberOfTeams - remainder;
    const mostFrequentStars = this.getMostFrequentStars(players);
    const peladaId = players[0]?.peladaId;

    const ghostPlayers: Player[] = Array.from(
      { length: missingPlayers },
      (_, index) =>
        new Player({
          name: `Ghost ${index + 1}`,
          stars: mostFrequentStars,
          peladaId,
        }),
    );

    return [...players, ...ghostPlayers];
  }
}
