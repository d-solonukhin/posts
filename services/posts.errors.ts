export class PostValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostValidationError';
  }
}

export class PostNotFoundError extends Error {
  constructor() {
    super('Пост не найден');
    this.name = 'PostNotFoundError';
  }
}

export function isPostValidationError(error: unknown): error is PostValidationError {
  return error instanceof Error && error.name === 'PostValidationError';
}

export function isPostNotFoundError(error: unknown): error is PostNotFoundError {
  return error instanceof Error && error.name === 'PostNotFoundError';
}
