import {
  ConflictError,
  DomainError,
  NotFoundError,
  UnauthorizedError,
} from './domain-errors';

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('Usuário não foi encontrado.', 'USER_NOT_FOUND');
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('E-mail ou username incorretos.', 'INVALID_CREDENTIALS');
  }
}

export class InvalidPasswordError extends UnauthorizedError {
  constructor() {
    super('Senha incorreta.', 'INVALID_PASSWORD');
  }
}

export class InvalidTokenError extends UnauthorizedError {
  constructor() {
    super('Token inválido ou malformado.', 'INVALID_TOKEN');
  }
}

export class ExpiredTokenError extends UnauthorizedError {
  constructor() {
    super('Refresh token inválido ou expirado.', 'EXPIRED_TOKEN');
  }
}

export class MissingAccessTokenError extends UnauthorizedError {
  constructor() {
    super('Access token ausente.', 'MISSING_ACCESS_TOKEN');
  }
}

export class MissingRefreshTokenError extends UnauthorizedError {
  constructor() {
    super('Refresh token ausente.', 'MISSING_REFRESH_TOKEN');
  }
}

export class MissingTokenDataError extends DomainError {
  constructor() {
    super('Token ausente ou malformado.', 'MISSING_TOKEN_DATA');
  }
}

export class TokenAlreadyExpiredError extends DomainError {
  constructor() {
    super(
      'Não é possível criar um token que já nasce expirado.',
      'TOKEN_ALREADY_EXPIRED',
    );
  }
}

export class InvalidEmailError extends DomainError {
  constructor() {
    super('E-mail inválido.', 'INVALID_EMAIL');
  }
}

export class WeakPasswordError extends DomainError {
  constructor() {
    super('A senha deve ter pelo menos 6 caracteres.', 'WEAK_PASSWORD');
  }
}

export class PasswordsDoNotMatchError extends DomainError {
  constructor() {
    super('As senhas não conferem.', 'PASSWORDS_DO_NOT_MATCH');
  }
}

export class InvalidUsernameError extends DomainError {
  constructor() {
    super(
      'O username deve conter apenas letras, números e "_".',
      'INVALID_USERNAME',
    );
  }
}

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Este e-mail já está em uso.', 'EMAIL_ALREADY_EXISTS');
  }
}

export class UsernameAlreadyExistsError extends ConflictError {
  constructor() {
    super('Este nome de usuário já está em uso.', 'USERNAME_ALREADY_EXISTS');
  }
}

export class InvalidResetTokenError extends UnauthorizedError {
  constructor() {
    super('Token de redefinição inválido.', 'INVALID_RESET_TOKEN');
  }
}

export class ExpiredResetTokenError extends UnauthorizedError {
  constructor() {
    super('Token de redefinição expirado.', 'EXPIRED_RESET_TOKEN');
  }
}

export class ResetTokenAlreadyUsedError extends UnauthorizedError {
  constructor() {
    super(
      'Este token de redefinição já foi utilizado.',
      'RESET_TOKEN_ALREADY_USED',
    );
  }
}
