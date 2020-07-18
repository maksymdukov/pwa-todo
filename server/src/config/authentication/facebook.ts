import passport from 'passport';
import passportFacebook, { StrategyOption } from 'passport-facebook';
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
      const possibleUser = await User.findByExternalId(
        AuthProviders.facebook,
        profile.id
      );
      if (!possibleUser) {
        // check if email is already registered
        if (profile.emails && profile.emails.length) {
          const userByEmail = await User.findByEmail(profile.emails[0].value);
          if (userByEmail) {
            return done(null, false, {
              message:
                'User with this email already exist. Login using it and link account',
            });
          }
        }
        // create user
        const newUser = await User.createUser(AuthProviders.facebook, {
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
    })
  );
}

passport.use(
  'facebook-link',
  new passportFacebook.Strategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${config.PUBLIC_URL}/api/v0/users/facebook-link/callback`,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'first_name',
        'last_name',
      ],
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      const possibleUser = await User.findByExternalId(
        AuthProviders.facebook,
        profile.id
      );
      if (possibleUser) {
        return done(null, false);
      }
      return done(null, {
        email: profile.emails[0]?.value || '',
        id: profile.id,
        linkToken: req.query.state,
      });
    }
  )
);
