import { Request, Response } from 'express';
import { User, AuthProviders, UserDocument } from '../models/User';
import { config } from '../config';
import { RequestValidationError } from '../errors/validation-error';
import { randomBytes } from 'crypto';
import {
  sendActivationToken,
  sendResetPasswordToken,
} from '../services/nodemailer';
import passport from 'passport';
import { PassportAuthProviders } from '../interfaces/passport-auth-providers';
import { CustomRequestError } from '../errors/request-error';
import { ErrorCodes } from '../errors/error-codes';

const PASSWORD_RESET_TOKEN_EXPIIRATION = 1000 * 60 * 15; // 15 mins;

export const generateUserTokens = (provider: PassportAuthProviders) => async (
  req: Request,
  res: Response
) => {
  passport.authenticate(
    provider,
    { session: false },
    async (err, user: UserDocument | null) => {
      const origin = `${config.CLIENT_PUBLIC_URL}/signin`;
      if (err || !user) {
        // if main account already exist then fail
        return res.render('authenticated', {
          accessToken: '',
          refreshToken: '',
          error:
            'User with this email already exist. Log into that account and link it.',
          origin,
        });
      }
      const { accessToken, refreshToken } = await user.generateAuthTokens();
      res.render('authenticated', {
        error: '',
        accessToken,
        refreshToken,
        origin,
      });
    }
  )(req, res);
};

export const updateRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken, userId } = req.body;
  const user = await User.findById(userId);
  if (
    !user ||
    user.refreshToken !== refreshToken ||
    user.refreshTokenExpiresAt < new Date()
  ) {
    return res.status(401).send();
  }
  const tokens = await user.generateAuthTokens();
  res.json(tokens);
};

export const registerUserViaEmail = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new RequestValidationError([
      { msg: 'Email is taken', param: 'email' },
    ]);
  }
  const newUser = await User.createUser(AuthProviders.email, {
    password,
    email,
    firstName,
    lastName,
  });
  sendActivationToken(newUser.email, newUser.emailActivationToken);
  res.send();
};

export const resendEmailActivationToken = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  const user = await User.findByPrimaryEmail(email);
  if (user.activated) {
    throw new RequestValidationError([
      { msg: 'Already activated', param: 'email' },
    ]);
  }
  const token = await user.generateEmailActivationToken();
  await sendActivationToken(email, token);
  res.send();
};

export const activateEmailAccount = async (req: Request, res: Response) => {
  const {
    email,
    activationToken,
  }: { email: string; activationToken: string } = req.body;

  const user = await User.findOne({
    email,
    emailActivationToken: activationToken,
  });
  if (!user || user.emailActivationExpires < new Date()) {
    throw new RequestValidationError([
      { msg: 'Invalid input', param: 'email' },
      { msg: 'Invalid input', param: 'actionationToken' },
    ]);
  }
  user.activated = true;
  user.emailActivationToken = undefined;
  user.emailActivationExpires = undefined;
  await user.save();
  // auto-login after activation user
  const tokens = await user.generateAuthTokens();
  res.json(tokens);
};

export const loginViaEmail = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  const user = await User.findByPrimaryEmail(email);
  if (!user) {
    throw new RequestValidationError([
      { msg: 'Wrong email or password', param: 'email' },
      { msg: 'Wrong email or password', param: 'password' },
    ]);
  }
  if (!user.activated) {
    throw new CustomRequestError(
      'Email needs activation',
      ErrorCodes.NOT_ACTIVATED
    );
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new RequestValidationError([
      { msg: 'Invalid email or password', param: 'email' },
      { msg: 'Invalid email or password', param: 'password' },
    ]);
  }
  const tokens = await user.generateAuthTokens();
  res.json(tokens);
};

export const resetPasswordStart = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new RequestValidationError([
      { msg: 'Email not found', param: 'email' },
    ]);
  }
  user.passwordResetToken = randomBytes(12).toString('hex');
  user.passwordResetExpires = new Date(
    Date.now() + PASSWORD_RESET_TOKEN_EXPIIRATION
  );
  await user.save();

  await sendResetPasswordToken(user.email, user.passwordResetToken);
  res.send();
};

export const resetPasswordFinish = async (req: Request, res: Response) => {
  const {
    email,
    resetToken,
    newPassword,
  }: { email: string; resetToken: string; newPassword: string } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new RequestValidationError([
      { msg: 'Email not found', param: 'email' },
    ]);
  }

  if (
    user.passwordResetToken !== resetToken ||
    user.passwordResetExpires < new Date()
  ) {
    throw new RequestValidationError([
      { msg: 'Invalid token', param: 'resetToken' },
    ]);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.send();
};
