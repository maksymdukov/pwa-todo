import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: { msg: string; param: string }[]) {
    super('User input is invalid');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
