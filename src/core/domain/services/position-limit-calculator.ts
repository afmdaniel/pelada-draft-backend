import { Player } from '../entities/player.entity';
import { PlayerPosition } from '../constants/player-position';
import { PositionLimits } from '../value-objects/position-limits';

export class PositionLimitCalculator {
  static calculate(players: Player[], numberOfTeams: number): PositionLimits {
    const positions = Object.values(PlayerPosition);

    const limits = {} as Record<
      PlayerPosition,
      {
        min: number;
        max: number;
      }
    >;

    for (const position of positions) {
      const total = players.filter((p) => p.position === position).length;

      limits[position] = {
        min: Math.floor(total / numberOfTeams),
        max: Math.ceil(total / numberOfTeams),
      };
    }

    return new PositionLimits(limits);
  }
}
