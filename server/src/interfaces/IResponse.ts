import { Request } from 'express';
import { UserDocument } from '../models/User';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
