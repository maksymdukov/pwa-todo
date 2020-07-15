import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  addWebPushSubscription,
  getUsers,
  getProfile,
  removeWebPushSubscription,
  checkWebPushSubscription,
  changePassword,
  linkAuthProvider,
  unlinkAuthProvider,
  linkAuthProviderStart,
  getLinkToken,
  saveProfile,
  deleteAccount,
} from '../../controllers/users.controller';
import { body, query } from 'express-validator';
import { validateInput } from '../../middlewares/validate-input';
import { PassportAuthProviders } from '../../interfaces/passport-auth-providers';

export const usersRouter = Router();

usersRouter.get(
  '/google-link/start',
  [
    query('id').isMongoId(),
    query('linkToken').isHexadecimal().isLength({ min: 24, max: 24 }),
  ],
  validateInput,
  linkAuthProviderStart(PassportAuthProviders.googleLink, {
    scope: ['openid', 'profile', 'email'],
  })
);

usersRouter.get(
  '/google-link/callback',
  linkAuthProvider(PassportAuthProviders.googleLink)
);

usersRouter.get(
  '/facebook-link/start',
  [
    query('id').isMongoId(),
    query('linkToken').isHexadecimal().isLength({ min: 24, max: 24 }),
  ],
  validateInput,
  linkAuthProviderStart(PassportAuthProviders.facebookLink)
);

usersRouter.get(
  '/facebook-link/callback',
  linkAuthProvider(PassportAuthProviders.facebookLink)
);

usersRouter.get('/', isAuthenticated, getUsers);
usersRouter.get('/profile', isAuthenticated, getProfile);
usersRouter.patch(
  '/profile',
  isAuthenticated,
  [
    body('firstName').isLength({ min: 3 }),
    body('lastName').isLength({ min: 3 }),
  ],
  validateInput,
  saveProfile
);
usersRouter.post(
  '/changepassword',
  isAuthenticated,
  [body('newPassword').isLength({ min: 8 })],
  validateInput,
  changePassword
);

usersRouter.get('/getlinktoken', isAuthenticated, getLinkToken);
usersRouter.post('/deleteaccount', isAuthenticated, deleteAccount);

usersRouter.patch(
  '/unlink-provider',
  isAuthenticated,
  body('provider').custom((inp) => {
    if (inp !== 'google' && inp !== 'facebook') {
      throw new Error('Should be either google or facebook');
    }
    return true;
  }),
  validateInput,
  unlinkAuthProvider
);

usersRouter.get(
  '/webpush',
  isAuthenticated,
  query('endpoint').isURL(),
  validateInput,
  checkWebPushSubscription
);

usersRouter.post(
  '/webpush',
  isAuthenticated,
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
  isAuthenticated,
  [
    body('endpoint').isURL(),
    body('keys.auth').isLength({ min: 3 }),
    body('keys.p256dh').isLength({ min: 3 }),
  ],
  validateInput,
  removeWebPushSubscription
);
