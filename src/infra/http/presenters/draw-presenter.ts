import { Team } from '../../../core/domain/entities/team.entity';
import { PlayerPresenter } from './player-presenter';

export interface DrawHTTPResponse {
  totalStars: number;
  players: ReturnType<typeof PlayerPresenter.toSummaryHTTP>[];
}

export class DrawPresenter {
  static toHTTP(teams: Team[]): DrawHTTPResponse[] {
    return teams.map((team) => {
      return {
        totalStars: team.totalStars,
        players: team.players.map((t) => PlayerPresenter.toSummaryHTTP(t)),
      };
    });
  }
}
