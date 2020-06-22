import passport from 'passport';
import passportJwt from 'passport-jwt';
import { User } from '../../models/User';

const jwtOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
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
