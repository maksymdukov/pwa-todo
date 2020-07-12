import { CustomError } from './custom-error';

export class AuthorizationError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
  serializeErrors() {
    return [{ message: 'You are not authorized' }];
  }
}
