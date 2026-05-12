import { Player } from '../entities/player.entity';
import { drawTeams } from './draw-teams';

describe('DrawTeams Algorithm', () => {
  it('should create the correct number of teams', () => {
    const players: Player[] = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 8 }),
      new Player({ name: 'Player 3', stars: 7 }),
      new Player({ name: 'Player 4', stars: 3 }),
    ];

    const teams = drawTeams(players, 2);

    expect(teams).toHaveLength(2);
  });

  it('should distribute all players', () => {
    const players: Player[] = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 8 }),
      new Player({ name: 'Player 3', stars: 7 }),
      new Player({ name: 'Player 4', stars: 3 }),
      new Player({ name: 'Player 5', stars: 7 }),
      new Player({ name: 'Player 6', stars: 6 }),
      new Player({ name: 'Player 7', stars: 9 }),
      new Player({ name: 'Player 8', stars: 6 }),
      new Player({ name: 'Player 9', stars: 4 }),
      new Player({ name: 'Player 10', stars: 5 }),
      new Player({ name: 'Player 11', stars: 6 }),
      new Player({ name: 'Player 12', stars: 5 }),
    ];

    const teams = drawTeams(players, 2);

    const distributedPlayers = teams.flat();

    expect(distributedPlayers).toHaveLength(players.length);
  });

  it('should not lose players', () => {
    const players: Player[] = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 8 }),
      new Player({ name: 'Player 3', stars: 7 }),
      new Player({ name: 'Player 4', stars: 3 }),
      new Player({ name: 'Player 5', stars: 7 }),
      new Player({ name: 'Player 6', stars: 6 }),
      new Player({ name: 'Player 7', stars: 9 }),
      new Player({ name: 'Player 8', stars: 6 }),
      new Player({ name: 'Player 9', stars: 4 }),
      new Player({ name: 'Player 10', stars: 5 }),
      new Player({ name: 'Player 11', stars: 6 }),
      new Player({ name: 'Player 12', stars: 5 }),
    ];

    const teams = drawTeams(players, 2);

    const distributedPlayerNames = teams.flat().map((player) => player.name);
    const originalPlayerNames = players.map((player) => player.name);

    expect(distributedPlayerNames.sort()).toEqual(originalPlayerNames.sort());
  });

  it('should create balanced teams with max score difference <= 1', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 8 }),
      new Player({ name: 'Player 3', stars: 7 }),
      new Player({ name: 'Player 4', stars: 3 }),
      new Player({ name: 'Player 5', stars: 7 }),
      new Player({ name: 'Player 6', stars: 6 }),
      new Player({ name: 'Player 7', stars: 9 }),
      new Player({ name: 'Player 8', stars: 6 }),
      new Player({ name: 'Player 9', stars: 4 }),
      new Player({ name: 'Player 10', stars: 5 }),
      new Player({ name: 'Player 11', stars: 6 }),
      new Player({ name: 'Player 12', stars: 5 }),
    ];

    const teams: Player[][] = drawTeams(players, 4);

    const teamScores = teams.map((t) => t.reduce((acc, p) => acc + p.stars, 0));

    const minScoreIndex = teamScores.indexOf(Math.min(...teamScores));
    const maxScoreIndex = teamScores.indexOf(Math.max(...teamScores));

    expect(
      Math.abs(teamScores[maxScoreIndex] - teamScores[minScoreIndex]),
    ).toBeLessThanOrEqual(1);
  });

  it('should not mutate the original players array', () => {
    const players: Player[] = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 8 }),
      new Player({ name: 'Player 3', stars: 7 }),
    ];

    const original = [...players];

    drawTeams(players, 2);

    expect(players).toEqual(original);
  });
});
