import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  addWebPushSubscription,
  getUsers,
  getProfile,
  removeWebPushSubscription,
  checkWebPushSubscription,
} from '../../controllers/users.controller';
import { body, query } from 'express-validator';
import { validateInput } from '../../middlewares/validate-input';

export const usersRouter = Router();

usersRouter.use(isAuthenticated);

usersRouter.get('/', getUsers);
usersRouter.get('/profile', getProfile);

usersRouter.get(
  '/webpush',
  query('endpoint').isURL(),
  validateInput,
  checkWebPushSubscription
);

usersRouter.post(
  '/webpush',
  [
    body('endpoint').isURL(),
    body('keys.auth').isLength({ min: 3 }),
    body('keys.p256dh').isLength({ min: 3 }),
  ],
  validateInput,
  addWebPushSubscription
);

usersRouter.delete(
  '/webpush',
  [
    body('endpoint').isURL(),
    body('keys.auth').isLength({ min: 3 }),
    body('keys.p256dh').isLength({ min: 3 }),
  ],
  validateInput,
  removeWebPushSubscription
);
