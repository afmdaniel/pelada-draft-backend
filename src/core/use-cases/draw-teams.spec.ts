import { Player } from '../entities/player.entity';
import {
  drawTeams,
  fillWithGhostPlayers,
  getMostFrequentStars,
} from './draw-teams';

describe('getMostFrequentStars', () => {
  it('should return the most frequent stars value', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 4 }),
      new Player({ name: 'Player 4', stars: 3 }),
    ];

    const result = getMostFrequentStars(players);

    expect(result).toBe(4);
  });

  it('should return the first stars value when all frequencies are equal', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 3 }),
    ];

    const result = getMostFrequentStars(players);

    expect(result).toBe(5);
  });

  it('should return 0 for an empty players array', () => {
    const result = getMostFrequentStars([]);

    expect(result).toBe(0);
  });

  it('should handle a single player', () => {
    const players = [new Player({ name: 'Player 1', stars: 2 })];

    const result = getMostFrequentStars(players);

    expect(result).toBe(2);
  });
});

describe('fillWithGhostPlayers', () => {
  it('should return the same array when division is exact', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 3 }),
      new Player({ name: 'Player 4', stars: 2 }),
    ];

    const result = fillWithGhostPlayers(players, 2);

    expect(result).toHaveLength(4);
    expect(result).toEqual(players);
  });

  it('should add ghost players when division is uneven', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 4 }),
    ];

    const result = fillWithGhostPlayers(players, 2);

    expect(result).toHaveLength(4);

    const ghostPlayers = result.filter((player) =>
      player.name.startsWith('Ghost'),
    );

    expect(ghostPlayers).toHaveLength(1);
  });

  it('should create ghost players with the most frequent stars value', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 3 }),
      new Player({ name: 'Player 3', stars: 3 }),
    ];

    const result = fillWithGhostPlayers(players, 2);

    const ghostPlayer = result.find((player) =>
      player.name.startsWith('Ghost'),
    );

    expect(ghostPlayer?.stars).toBe(3);
  });

  it('should add the correct number of ghost players', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 3 }),
      new Player({ name: 'Player 4', stars: 2 }),
      new Player({ name: 'Player 5', stars: 1 }),
    ];

    const result = fillWithGhostPlayers(players, 3);

    const ghostPlayers = result.filter((player) =>
      player.name.startsWith('Ghost'),
    );

    expect(ghostPlayers).toHaveLength(1);
  });

  it('should preserve original players', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 3 }),
    ];

    const result = fillWithGhostPlayers(players, 2);

    expect(result[0].name).toBe('Player 1');
    expect(result[1].name).toBe('Player 2');
    expect(result[2].name).toBe('Player 3');
  });
});

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

  it('should distribute ghost players when necessary', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 3 }),
    ];

    const teams = drawTeams(players, 2);

    const allPlayers = teams.flat();

    const ghostPlayers = allPlayers.filter((player) =>
      player.name.startsWith('Ghost'),
    );

    expect(ghostPlayers).toHaveLength(1);
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

  it('should create balanced teams with uneven player count', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
      new Player({ name: 'Player 3', stars: 4 }),
      new Player({ name: 'Player 4', stars: 3 }),
      new Player({ name: 'Player 5', stars: 2 }),
    ];

    const teams = drawTeams(players, 2);

    expect(teams[0]).toHaveLength(3);
    expect(teams[1]).toHaveLength(3);
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

  it('should handle more teams than players', () => {
    const players = [
      new Player({ name: 'Player 1', stars: 5 }),
      new Player({ name: 'Player 2', stars: 4 }),
    ];

    const teams = drawTeams(players, 4);

    expect(teams).toHaveLength(4);

    const totalPlayers = teams.flat();

    expect(totalPlayers.length).toBeGreaterThanOrEqual(4);
  });
});
