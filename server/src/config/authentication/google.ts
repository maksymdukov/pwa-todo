import passport from 'passport';
import passportGoogle, {
  IOAuth2StrategyOption,
  Profile,
  VerifyFunction
} from 'passport-google-oauth';
import { AuthProviders, User } from '../../models/User';

const opts: IOAuth2StrategyOption = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.PUBLIC_URL}/api/v0/auth/google/callback`,
  accessType: 'code',
  prompt: 'select_account'
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
        // TODO
        // check if email is already registered
        // create user
        const newUser = await User.createUser(AuthProviders.google, {
          id: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: profile.photos[0].value
        });
        return done(null, newUser);
      }
      // return user from DB or create him
      return done(null, possibleUser);
    }
  )
);

passport.use(
  'google-link',
  new passportGoogle.OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.PUBLIC_URL}/api/v0/auth/google-link/callback`,
      accessType: 'code'
    },
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
      if (possibleUser) {
        return done({ message: 'User with this googleId already exist' });
      }
      return done(null, { accessToken });
    }
  )
);
