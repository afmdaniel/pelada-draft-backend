export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(public readonly value: T) {}
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(public readonly error: E) {}
}

export type Result<T, E> = Success<T> | Failure<E>;

export const Result = {
  ok: <T>(value: T): Success<T> => new Success<T>(value),
  fail: <E>(error: E): Failure<E> => new Failure<E>(error),
};
