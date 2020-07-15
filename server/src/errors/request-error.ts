import { CustomError } from './custom-error';
import { ErrorCodes } from './error-codes';

export class CustomRequestError extends CustomError {
  statusCode = 400;
  errorCode?: ErrorCodes;
  constructor(msg: string, errorCode?: ErrorCodes) {
    super(msg);
    if (errorCode) {
      this.errorCode = errorCode;
    }
    Object.setPrototypeOf(this, CustomRequestError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.message,
        field: 'error',
        code: this.errorCode,
      },
    ];
  }
}
