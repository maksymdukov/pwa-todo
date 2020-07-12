export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
