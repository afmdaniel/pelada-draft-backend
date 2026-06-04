import { DomainError, NotFoundError } from './domain-errors';

export class PeladaNotFoundError extends NotFoundError {
  constructor() {
    super('Pelada não encontrada.', 'PELADA_NOT_FOUND');
  }
}

export class MissingOwnerIDError extends DomainError {
  constructor() {
    super('A pelada deve pertencer a um usuário.', 'MISSING_OWNER_ID');
  }
}

export class MissingPeladaNameError extends DomainError {
  constructor() {
    super('O nome da pelada é obrigatório.', 'MISSING_PELADA_NAME');
  }
}

export class InvalidPeladaNameError extends DomainError {
  constructor() {
    super(
      'O nome da pelada deve ter pelo menos 3 caracteres.',
      'INVALID_PELADA_NAME',
    );
  }
}

export class InvalidPeladaCharsError extends DomainError {
  constructor() {
    super(
      'O nome da pelada não pode conter caracteres especiais.',
      'INVALID_PELADA_CHARS',
    );
  }
}

export class OwnerImplicitAccessError extends DomainError {
  constructor() {
    super(
      'O dono da pelada já possui acesso total implícito.',
      'OWNER_IMPLICIT_ACCESS',
    );
  }
}

export class InvalidPermissionActionError extends DomainError {
  constructor() {
    super('Ação de permissão inválida.', 'INVALID_ACTION');
  }
}

export class MissingRelationsError extends DomainError {
  constructor() {
    super(
      'A permissão deve estar vinculada a um usuário e a uma pelada.',
      'MISSING_RELATIONS',
    );
  }
}

export class InvalidPrivilegeError extends DomainError {
  constructor() {
    super('Privilégio inválido.', 'INVALID_PRIVILEGE');
  }
}
