import { Player } from '../entities/player.entity';

export class DrawContext {
  constructor(
    public readonly peladaId: string,
    public readonly players: Player[],
    public readonly numberOfTeams: number,
    public readonly withPosition: boolean,
  ) {}
}
