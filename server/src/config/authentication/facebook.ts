import passport from 'passport';
import passportFacebook, { StrategyOption } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import { AuthProviders, User } from '../../models/User';
import { config } from '..';

const passportConfig: StrategyOption = {
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${config.PUBLIC_URL}/api/v0/auth/facebook/callback`,
  profileFields: [
    'id',
    'displayName',
    'photos',
    'email',
    'first_name',
    'last_name',
  ],
};

if (passportConfig.clientID) {
  passport.use(
    new passportFacebook.Strategy(passportConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      console.log(profile);
      const possibleUser = await User.findByExternalId(
        AuthProviders.facebook,
        profile.id
      );
      console.log('possibleUser', possibleUser);
      if (!possibleUser) {
        // TODO
        // check if email is already registered
        // create user
        const newUser = await User.createUser(AuthProviders.facebook, {
          id: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          picture: profile.photos[0].value,
        });
        console.log('newUser', newUser);
        return done(null, newUser);
      }
      // return user from DB or create him
      return done(null, possibleUser);
    })
  );
}

passport.use(
  'facebook-link',
  new passportFacebook.Strategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${config.PUBLIC_URL}/api/v0/auth/facebook-link/callback`,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'first_name',
        'last_name',
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      const possibleUser = await User.findByExternalId(
        AuthProviders.facebook,
        profile.id
      );
      if (possibleUser) {
        return done({ message: 'User with this facebookId already exist' });
      }
      return done(null, { accessToken });
    }
  )
);
