import { DrawBalancerService } from '../services/draw-balancer.service';
import { Player } from '../entities/player.entity';

describe('DrawBalancerService (Unit Tests)', () => {
  const makePlayers = (count: number, stars: number = 3) => {
    return Array.from(
      { length: count },
      (_, i) =>
        new Player({
          name: `Player ${i + 1}`,
          stars,
          peladaId: 'pelada-1',
        }),
    );
  };

  it('should draw teams and balance them by stars', () => {
    const players: Player[] = [
      new Player({ name: 'Pro 1', stars: 5, peladaId: '1' }),
      new Player({ name: 'Pro 2', stars: 5, peladaId: '1' }),
      new Player({ name: 'Basic 1', stars: 2, peladaId: '1' }),
      new Player({ name: 'Basic 2', stars: 2, peladaId: '1' }),
    ];

    const teams = DrawBalancerService.draw(players, 2);

    const scoreTeam1 = teams[0].reduce((acc, p) => acc + p.stars, 0);
    const scoreTeam2 = teams[1].reduce((acc, p) => acc + p.stars, 0);

    expect(scoreTeam1).toBe(7);
    expect(scoreTeam2).toBe(7);
    expect(teams[0]).toHaveLength(2);
    expect(teams[1]).toHaveLength(2);
  });

  it('should fill with ghost players when total count is not divisible by number of teams', () => {
    const players = makePlayers(5, 3);
    const teams = DrawBalancerService.draw(players, 2);

    expect(teams[0]).toHaveLength(3);
    expect(teams[1]).toHaveLength(3);

    const allPlayers = [...teams[0], ...teams[1]];
    const ghostPlayers = allPlayers.filter((p) => p.name.includes('Ghost'));

    expect(ghostPlayers).toHaveLength(1);
    expect(ghostPlayers[0].stars).toBe(3);
  });

  it('should maintain randomness while balancing (jitter test)', () => {
    const players = [
      new Player({ name: 'Player A', stars: 5, peladaId: '1' }),
      new Player({ name: 'Player B', stars: 5, peladaId: '1' }),
    ];

    const teams = DrawBalancerService.draw(players, 2);

    const totalStars = teams.flat().reduce((acc, p) => acc + p.stars, 0);
    expect(totalStars).toBe(10);
    expect(teams[0][0].stars).toBe(5);
    expect(teams[1][0].stars).toBe(5);
  });

  it('should correctly identify the most frequent star rating for ghosts', () => {
    const players = [
      new Player({ name: 'P1', stars: 5, peladaId: '1' }),
      new Player({ name: 'P2', stars: 2, peladaId: '1' }),
      new Player({ name: 'P3', stars: 2, peladaId: '1' }),
    ];

    const teams = DrawBalancerService.draw(players, 2); // 3 players -> precisa de 1 ghost
    const allPlayers = teams.flat();
    const ghost = allPlayers.find((p) => p.name.includes('Ghost'));

    expect(ghost?.stars).toBe(2);
  });
});
