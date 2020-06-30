import { ErrorCodes } from "./error-codes";

export abstract class CustomError extends Error {
  constructor(public code: ErrorCodes, message?: string) {
    super(message);
  }
}
