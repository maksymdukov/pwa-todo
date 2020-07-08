import { CustomError } from "./custom-error";
import { ErrorCodes } from "./error-codes";

export class AuthorizationError extends CustomError {
  constructor() {
    super(ErrorCodes.AUTHORIZATION_ERROR);
  }
}
