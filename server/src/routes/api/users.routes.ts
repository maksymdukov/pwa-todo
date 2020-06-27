import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  addWebPushSubscription,
  getUsers,
  getProfile,
} from '../../controllers/users.controller';

export const usersRouter = Router();

usersRouter.use(isAuthenticated);

usersRouter.get('/', getUsers);
usersRouter.get('/profile', getProfile);
usersRouter.post('/webpush', addWebPushSubscription);
