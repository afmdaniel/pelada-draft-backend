import { AppError } from './app-error';

export class DomainError extends AppError {
  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message, code, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, code, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code: string = 'NOT_FOUND') {
    super(message, code, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, code: string = 'UNAUTHORIZED') {
    super(message, code, 401);
  }
}

export class InfrastructureError extends Error {
  public readonly code = 'INTERNAL_INFRA_ERROR';
  constructor(message: string) {
    super(message);
  }
}
