import { CustomError } from "./custom-error";
import { ErrorCodes } from "./error-codes";

export class InvalidRefreshToken extends CustomError {
  constructor() {
    super(ErrorCodes.ERR_REFRESHING_TOKEN);
  }
}
