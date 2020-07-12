import { Router } from 'express';
import passport from 'passport';
import {
  updateRefreshToken,
  generateUserTokens,
  registerUserViaEmail,
  loginViaEmail,
  resetPasswordStart,
  resetPasswordFinish,
  activateEmailAccount,
} from '../../controllers/auth.controller';
import { body } from 'express-validator';
import { validateInput } from '../../middlewares/validate-input';
import { PassportAuthProviders } from '../../interfaces/passport-auth-providers';

const authRouter = Router();

authRouter.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').isLength({ min: 3 }),
    body('lastName').isLength({ min: 3 }),
  ],
  validateInput,
  registerUserViaEmail
);

authRouter.post(
  '/activateemail',
  [
    body('email').isEmail(),
    body('activationToken').isHexadecimal().isLength({ min: 24, max: 24 }),
  ],
  validateInput,
  activateEmailAccount
);

authRouter.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 8 })],
  validateInput,
  loginViaEmail
);

authRouter.post(
  '/resetpasswordstart',
  [body('email').isEmail()],
  validateInput,
  resetPasswordStart
);

authRouter.post(
  '/resetpasswordfinish',
  [
    body('email').isEmail(),
    body('resetToken').isHexadecimal().isLength({ min: 24, max: 24 }),
    body('newPassword').isLength({ min: 8 }),
  ],
  validateInput,
  resetPasswordFinish
);

authRouter.get(
  '/google/start',
  passport.authenticate(PassportAuthProviders.google, {
    session: false,
    scope: ['openid', 'profile', 'email'],
  })
);

authRouter.get(
  '/google/callback',
  generateUserTokens(PassportAuthProviders.google)
);

authRouter.get(
  '/facebook/start',
  passport.authenticate(PassportAuthProviders.facebook, {
    session: false,
  })
);

authRouter.get(
  '/facebook/callback',
  generateUserTokens(PassportAuthProviders.facebook)
);

authRouter.post('/token', updateRefreshToken);

export default authRouter;
