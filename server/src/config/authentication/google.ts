import passport from 'passport';
import passportGoogle, {
  IOAuth2StrategyOption,
  Profile,
  VerifyFunction,
} from 'passport-google-oauth';
import { AuthProviders, User } from '../../models/User';
import { config } from '..';
import { PassportAuthProviders } from '../../interfaces/passport-auth-providers';
import { Request } from 'express';

const opts: IOAuth2StrategyOption = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: `${config.PUBLIC_URL}/api/v0/auth/google/callback`,
  accessType: 'code',
  prompt: 'select_account',
};

passport.use(
  new passportGoogle.OAuth2Strategy(
    opts,
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyFunction
    ) => {
      const possibleUser = await User.findByExternalId(
        AuthProviders.google,
        profile.id
      );
      if (!possibleUser) {
        // check if email is already registered
        const userByEmail = await User.findByEmail(profile.emails[0].value);
        if (userByEmail) {
          return done(null, false, {
            message:
              'User with this email already exist. Login using it and link account',
          });
        }
        // create user
        const newUser = await User.createUser(AuthProviders.google, {
          id: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: profile.photos[0].value,
        });
        return done(null, newUser);
      }
      // return user from DB or create him
      return done(null, possibleUser);
    }
  )
);

passport.use(
  PassportAuthProviders.googleLink,
  new passportGoogle.OAuth2Strategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.PUBLIC_URL}/api/v0/users/google-link/callback`,
      accessType: 'code',
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyFunction
    ) => {
      const possibleUser = await User.findByExternalId(
        AuthProviders.google,
        profile.id
      );
      if (possibleUser) {
        // already used in the app somewhere
        return done(null, false);
      }
      return done(null, {
        email: profile.emails[0]?.value,
        id: profile.id,
        linkToken: req.query.state,
      });
    }
  )
);
