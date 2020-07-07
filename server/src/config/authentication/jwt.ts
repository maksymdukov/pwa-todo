import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from '../../models/User';
import { config } from '..';

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  issuer: config.JWT_ISSUER,
  audience: config.JWT_AUDIENCE,
};

passport.use(
  new passportJwt.Strategy(jwtOptions, async (payload, done) => {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user, payload);
  })
);
