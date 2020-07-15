import { Response, Request, NextFunction } from 'express';
import { WebSubscription } from '../interfaces/IWebSubscription';
import { User, UserDocument } from '../models/User';
import passport from 'passport';
import { PassportAuthProviders } from '../interfaces/passport-auth-providers';
import { config } from '../config';
import { randomBytes } from 'crypto';
import { RequestValidationError } from '../errors/validation-error';
import { Todo, TodoDocument } from '../models/Todo';
import { TodoHistory, TodoHistoryDocument } from '../models/TodoHistory';
import { TodoHistoryReason } from '../models/TodoHistoryReason';

const LINK_TOKEN_EXPIRES = 1000 * 60; // 1 min

export const checkWebPushSubscription = async (req: Request, res: Response) => {
  const { endpoint } = req.query as { endpoint: string };
  console.log('endpoint', endpoint);

  const found = req.user.webSubscriptions.find(
    (websub) => websub.endpoint === endpoint
  );
  res.status(found ? 200 : 400).send();
};

export const addWebPushSubscription = async (req: Request, res: Response) => {
  const subscription: WebSubscription = req.body;
  req.user.webSubscriptions.push(subscription);
  await req.user.save();
  res.end();
};

export const removeWebPushSubscription = async (
  req: Request,
  res: Response
) => {
  const subscription: WebSubscription = req.body;
  await User.removeSubscription(req.user.id, subscription.endpoint);
  res.end();
};

export const getUsers = async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };
  const users = await User.getUsers({ email });
  res.json(users);
};

export const getProfile = async (req: Request, res: Response) => {
  res.json(req.user.getProfile());
};

export const saveProfile = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
  }: { firstName: string; lastName: string } = req.body;
  req.user.set('profile.firstName', firstName);
  req.user.set('profile.lastName', lastName);
  const saved = await req.user.save();
  res.json(saved.getProfile());
};

export const changePassword = async (req: Request, res: Response) => {
  const { newPassword }: { newPassword: string } = req.body;
  req.user.password = newPassword;
  await req.user.save();
  res.send();
};

export const getLinkToken = async (req: Request, res: Response) => {
  req.user.linkToken = randomBytes(12).toString('hex');
  req.user.linkTokenExpires = new Date(Date.now() + LINK_TOKEN_EXPIRES);
  await req.user.save();
  res.json({ linkToken: req.user.linkToken });
};

export const linkAuthProviderStart = (
  provider:
    | PassportAuthProviders.googleLink
    | PassportAuthProviders.facebookLink,
  authenticateProps?: passport.AuthenticateOptions
) => async (req: Request, res: Response, next: NextFunction) => {
  const { id, linkToken } = req.query as {
    id: string;
    linkToken: string;
  };
  const usr = await User.findOne({ _id: id, linkToken });
  if (!usr || usr.linkTokenExpires < new Date()) {
    throw new RequestValidationError([
      { param: id, msg: 'Invalid id or token' },
      { param: linkToken, msg: 'Invalid id or token' },
    ]);
  }
  passport.authenticate(provider, {
    session: false,
    state: linkToken,
    passReqToCallback: true,
    ...authenticateProps,
  })(req, res, next);
};

const renderErrorResponse = (
  res: Response,
  origin: string,
  error: string = 'This account is already used in the system.'
) =>
  res.render('authenticated', {
    accessToken: '',
    refreshToken: '',
    error,
    origin,
  });

export const linkAuthProvider = (authProvider: PassportAuthProviders) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = `${config.CLIENT_PUBLIC_URL}/profile`;

  passport.authenticate(
    authProvider,
    { session: false },
    async (err, user: { email?: string; id: string; linkToken: string }) => {
      if (err || !user) {
        return renderErrorResponse(res, origin);
      }
      const authUser = await User.findOne({ linkToken: user.linkToken });

      if (!authUser) {
        return renderErrorResponse(res, origin, 'Error occured');
      }

      if (
        authProvider === PassportAuthProviders.googleLink &&
        (authUser.googleId || authUser.linked?.googleId)
      ) {
        return renderErrorResponse(
          res,
          origin,
          'Google account is already used'
        );
      }

      if (
        authProvider === PassportAuthProviders.facebookLink &&
        (authUser.facebookId || authUser.linked?.facebookId)
      ) {
        return renderErrorResponse(
          res,
          origin,
          'Facebook account is already used'
        );
      }

      if (authProvider === PassportAuthProviders.googleLink) {
        authUser.set('linked.googleId', user.id);
        authUser.set('linked.googleEmail', user.email);
      }

      if (authProvider === PassportAuthProviders.facebookLink) {
        authUser.set('linked.facebookId', user.id);
        authUser.set('linked.facebookEmail', user.email);
      }
      const savedUser = await authUser.save();
      console.log('savedUser', savedUser);

      res.render('authenticated', {
        error: '',
        accessToken: 'ok',
        refreshToken: 'ok',
        origin,
      });
    }
  )(req, res, next);
};

export const unlinkAuthProvider = async (req: Request, res: Response) => {
  const { provider }: { provider: 'google' | 'facebook' } = req.body;
  if (provider === 'google') {
    req.user.set('linked.googleId', undefined);
    req.user.set('linked.googleEmail', undefined);
  }

  if (provider === 'facebook') {
    req.user.set('linked.facebookId', undefined);
    req.user.set('linked.facebookEmail', undefined);
  }

  await req.user.save();
  res.send();
};

export const deleteAccount = async (req: Request, res: Response) => {
  // delete notes owned by this user
  const todos = await Todo.findTodosByCreatorId(req.user.id);
  const historyPromises = [];
  const removePromises = [];
  for (const todo of todos) {
    historyPromises.push(
      TodoHistory.build({
        userIds: [req.user.id],
        todo: todo,
        reason: TodoHistoryReason.deleted,
      })
    );
    removePromises.push(todo.remove());
  }
  await Promise.all(removePromises);
  await Promise.all(historyPromises);

  // unshare all todos shared with this user
  const sharedWithMePopulated = await Todo.findTodosBySharedId(
    req.user.id,
    true
  );

  const sharedWithMe = await Todo.findTodosBySharedId(req.user.id);
  const sharedPromises: Promise<TodoDocument>[] = [];
  sharedWithMe.forEach((todo) => {
    todo.shared = todo.shared.filter((usrId) => !usrId.equals(req.user.id));
    sharedPromises.push(todo.save());
  });
  await Promise.all(sharedPromises);

  const unsharedNotificationsPromises: Promise<TodoHistoryDocument>[] = [];
  sharedWithMePopulated.forEach((todo) => {
    unsharedNotificationsPromises.push(
      TodoHistory.build({
        userIds: [(todo.creator as UserDocument).id, req.user.id],
        todo: todo,
        reason: TodoHistoryReason.unshared,
      })
    );
  });
  await Promise.all(unsharedNotificationsPromises);

  // delete user record
  await req.user.remove();

  // Maybe release request earlier ?
  res.send();
};
