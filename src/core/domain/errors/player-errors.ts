import { DomainError, NotFoundError, ConflictError } from './domain-errors';

export class PlayerNotFoundError extends NotFoundError {
  constructor() {
    super('Jogador não encontrado nesta pelada.', 'PLAYER_NOT_FOUND');
  }
}

export class MissingPeladaIdError extends DomainError {
  constructor() {
    super('O jogador deve pertencer a uma pelada.', 'MISSING_PELADA_ID');
  }
}

export class PlayerAlreadyExistsError extends ConflictError {
  constructor() {
    super(
      'Já existe um jogador cadastrado com este nome nesta pelada.',
      'PLAYER_ALREADY_EXISTS',
    );
  }
}

export class InvalidPlayerNameError extends DomainError {
  constructor() {
    super('O nome deve ter pelo menos 2 caracteres.', 'INVALID_PLAYER_NAME');
  }
}

export class InvalidStarsError extends DomainError {
  constructor() {
    super(
      'O número de estrelas deve ser inteiro entre 1 e 10.',
      'INVALID_STARS',
    );
  }
}

export class NotEnoughPlayersError extends DomainError {
  constructor() {
    super(
      'A quantidade de jogadores deve ser maior ou igual ao número de times.',
      'NOT_ENOUGH_PLAYERS',
    );
  }
}
