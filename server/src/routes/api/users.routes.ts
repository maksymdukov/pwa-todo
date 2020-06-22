import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { User } from '../../models/User';
import { addWebPushSubscription } from '../../controllers/users.controller';

export const usersRouter = Router();

usersRouter.use(isAuthenticated);

usersRouter.get('/', async (req, res) => {
  const users = await User.getUsers();
  res.json(users);
});

usersRouter.get('/profile', isAuthenticated, (req, res) => {
  console.log('user', req.user);
  res.json(req.user);
});

usersRouter.post('/webpush', addWebPushSubscription);
