export class InfrastructureError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'INTERNAL_INFRA_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DataCorruptionError extends InfrastructureError {
  constructor(message: string) {
    super(message, 'DATA_CORRUPTION');
  }
}
