import { Player } from '../../../core/entities/player.entity';
import { PlayerPresenter } from './player-presenter';

export interface DrawHTTPResponse {
  totalStars: number;
  players: ReturnType<typeof PlayerPresenter.toSummaryHTTP>[];
}

export class DrawPresenter {
  static toHTTP(teams: Player[][]): DrawHTTPResponse[] {
    return teams.map((team) => {
      const totalStars = team.reduce((acc, player) => acc + player.stars, 0);

      return {
        totalStars,
        players: team.map((t) => PlayerPresenter.toSummaryHTTP(t)),
      };
    });
  }
}
