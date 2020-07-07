import { Router } from 'express';
import passport from 'passport';
import {
  updateRefreshToken,
  generateUserTokens,
} from '../../controllers/auth.controller';

const authRouter = Router();

authRouter.get(
  '/google/start',
  passport.authenticate('google', {
    session: false,
    scope: ['openid', 'profile', 'email'],
  })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  generateUserTokens
);

authRouter.get(
  '/facebook/start',
  passport.authenticate('facebook', {
    session: false,
  })
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  generateUserTokens
);

authRouter.post('/token', updateRefreshToken);

export default authRouter;
