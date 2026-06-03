import { PlayerPosition } from '../constants/player-position';

export class PositionLimits {
  constructor(
    private readonly limits: Record<
      PlayerPosition,
      {
        min: number;
        max: number;
      }
    >,
  ) {}

  getMin(position: PlayerPosition): number {
    return this.limits[position].min;
  }

  getMax(position: PlayerPosition): number {
    return this.limits[position].max;
  }

  contains(position: PlayerPosition, amount: number): boolean {
    const limit = this.limits[position];

    return amount >= limit.min && amount <= limit.max;
  }

  toObject() {
    return this.limits;
  }
}
