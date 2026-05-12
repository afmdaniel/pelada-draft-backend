import { Player } from '../entities/player.entity';

export function drawTeams(
  players: Player[],
  numberOfTeams: number,
): Player[][] {
  const sortedPlayers = [...players].sort((a, b) => b.stars - a.stars);

  const teams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
  const teamScores = Array(numberOfTeams).fill(0);

  sortedPlayers.forEach((player) => {
    const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));

    teams[minScoreIndex].push(player);
    teamScores[minScoreIndex] += player.stars;
  });

  return teams;
}
