import jwt from 'jsonwebtoken';
import { UserDocument } from '../../models/User';
import randtoken from 'rand-token';
import { config } from '..';

const REFRESH_TOKEN_TTL = 1000 * 3600 * 24 * 30; //30 days
const ACCESS_TOKEN_TTL = '1 day';
// const ACCESS_TOKEN_TTL = 100;

export const generateAccessToken = (user: UserDocument): string => {
  const expiresIn = ACCESS_TOKEN_TTL;
  const issuer = config.JWT_ISSUER;
  const audience = config.JWT_AUDIENCE;
  const secret = config.JWT_SECRET;
  return jwt.sign(
    {
      firstName: user.profile.firstName || '',
      lastName: user.profile.lastName || '',
      picture: user.profile.picture || '',
      email: user.email,
    },
    secret,
    {
      expiresIn,
      audience,
      issuer,
      subject: user.id,
    }
  );
};

export const generateRefreshToken = (): {
  refreshToken: string;
  expiresAt: Date;
} => ({
  refreshToken: randtoken.uid(256),
  expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
});
