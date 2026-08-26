import { StarsBalancerService } from './start-balancer.service';
import { Team } from '../entities/team.entity';
import { Player } from '../entities/player.entity';
import { PositionLimits } from '../value-objects/position-limits';
import { PlayerPosition } from '../constants/player-position';

function createPlayer(stars: number, position?: PlayerPosition): Player {
  const result = Player.create({
    name: 'Player',
    stars,
    peladaId: 'pelada-1',
    position,
  });

  return result.value as Player;
}

function createTeam(players: Player[]): Team {
  return new Team(players);
}

const PERMISSIVE_LIMITS = new PositionLimits({
  [PlayerPosition.ZAGA]: { min: 0, max: 99 },
  [PlayerPosition.MEIO]: { min: 0, max: 99 },
  [PlayerPosition.ATAQUE]: { min: 0, max: 99 },
  [PlayerPosition.GERAL]: { min: 0, max: 99 },
});

describe('StarsBalancerService', () => {
  let service: StarsBalancerService;

  beforeEach(() => {
    service = new StarsBalancerService();
  });

  it('returns true immediately when totals are already within 1 star of each other', () => {
    const teamA = createTeam([createPlayer(5), createPlayer(5)]);
    const teamB = createTeam([createPlayer(5), createPlayer(4)]);

    const result = service.balance([teamA, teamB], PERMISSIVE_LIMITS, false);

    expect(result).toBe(true);
    expect(teamA.totalStars).toBe(10);
    expect(teamB.totalStars).toBe(9);
  });

  it('prefers swapping the weakest players over stacking the strongest ones on the same team', () => {
    const teamA = createTeam(
      [8, 7, 6, 6, 5, 3].map((stars) => createPlayer(stars)),
    );
    const teamB = createTeam(
      [8, 7, 6, 6, 6, 4].map((stars) => createPlayer(stars)),
    );

    const result = service.balance([teamA, teamB], PERMISSIVE_LIMITS, false);

    expect(result).toBe(true);
    expect(teamA.players.map((p) => p.stars).sort((a, b) => b - a)).toEqual([
      8, 7, 6, 6, 5, 4,
    ]);
    expect(teamB.players.map((p) => p.stars).sort((a, b) => b - a)).toEqual([
      8, 7, 6, 6, 6, 3,
    ]);
  });

  it('keeps balancing every team, not just the single global min/max pair', () => {
    const teamA = createTeam([createPlayer(4), createPlayer(3)]);
    const teamB = createTeam([createPlayer(7), createPlayer(6)]);
    const teamC = createTeam([createPlayer(9), createPlayer(9)]);
    const teamD = createTeam([createPlayer(1), createPlayer(1)]);

    const teams = [teamA, teamB, teamC, teamD];

    const result = service.balance(teams, PERMISSIVE_LIMITS, false);

    expect(result).toBe(true);

    const totals = teams.map((team) => team.totalStars);
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThanOrEqual(1);
  });

  it('returns false when no swap can bring teams within 1 star of each other', () => {
    const teamA = createTeam([createPlayer(1)]);
    const teamB = createTeam([createPlayer(10)]);

    const result = service.balance([teamA, teamB], PERMISSIVE_LIMITS, false);

    expect(result).toBe(false);
  });

  it('tries another candidate pair when the closest pair cannot be balanced without breaking position limits', () => {
    const limits = new PositionLimits({
      [PlayerPosition.ZAGA]: { min: 1, max: 1 },
      [PlayerPosition.MEIO]: { min: 1, max: 1 },
      [PlayerPosition.ATAQUE]: { min: 0, max: 0 },
      [PlayerPosition.GERAL]: { min: 0, max: 0 },
    });

    const weakTeam = createTeam([
      createPlayer(3, PlayerPosition.ZAGA),
      createPlayer(3, PlayerPosition.MEIO),
    ]);
    const strongTeamWithoutValidSwap = createTeam([
      createPlayer(6, PlayerPosition.ZAGA),
      createPlayer(2, PlayerPosition.MEIO),
    ]);
    const strongTeamWithValidSwap = createTeam([
      createPlayer(4, PlayerPosition.ZAGA),
      createPlayer(4, PlayerPosition.MEIO),
    ]);

    const teams = [
      weakTeam,
      strongTeamWithoutValidSwap,
      strongTeamWithValidSwap,
    ];

    const result = service.balance(teams, limits, true);

    expect(result).toBe(true);

    const totals = teams.map((team) => team.totalStars);
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThanOrEqual(1);
    teams.forEach((team) => expect(team.isInsideLimits(limits)).toBe(true));
  });
});
