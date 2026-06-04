import { DomainError } from './domain-errors';

export class InvalidTeamCountError extends DomainError {
  constructor() {
    super('O sorteio deve gerar no mínimo 2 times.', 'INVALID_TEAM_COUNT');
  }
}

export class PlayersNotInPeladaError extends DomainError {
  constructor() {
    super(
      'Um ou mais jogadores selecionados não pertencem a esta pelada.',
      'PLAYERS_NOT_IN_PELADA',
    );
  }
}
