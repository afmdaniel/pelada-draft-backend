import { Player } from './player.entity';
import { PlayerPosition } from '../constants/player-position';
import { PositionLimits } from '../value-objects/position-limits';

type PositionCounter = Record<PlayerPosition, number>;

export class Team {
  public players: Player[] = [];

  constructor(players: Player[] = []) {
    this.players = players;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  get totalStars(): number {
    let sum = 0;
    for (const player of this.players) {
      sum += player.stars;
    }
    return sum;
  }

  get positionsCount(): PositionCounter {
    const POSITIONS = Object.values(PlayerPosition) as PlayerPosition[];
    const counts = POSITIONS.reduce((acc, pos) => {
      acc[pos] = 0;
      return acc;
    }, {} as PositionCounter);

    for (const player of this.players) {
      if (player.position) {
        counts[player.position]++;
      }
    }
    return counts;
  }

  isInsideLimits(limits: PositionLimits): boolean {
    const counts = this.positionsCount;
    const POSITIONS = Object.keys(PlayerPosition) as PlayerPosition[];

    console.log(POSITIONS);

    for (const position of POSITIONS) {
      const count = counts[position];

      if (count < limits.getMin(position) || count > limits.getMax(position)) {
        return false;
      }
    }

    return true;
  }

  swapPlayerWith(
    playerIndex: number,
    otherTeam: Team,
    otherPlayerIndex: number,
  ): void {
    const temp = this.players[playerIndex];

    this.players[playerIndex] = otherTeam.players[otherPlayerIndex];

    otherTeam.players[otherPlayerIndex] = temp;
  }
}
