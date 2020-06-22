import { Request, Response } from 'express';
import {
  generateAccessToken,
  generateRefreshToken
} from '../config/authentication/token';
import { User, UserDocument } from '../models/User';

export async function generateUserTokens(req: Request, res: Response) {
  const user = req.user as UserDocument;
  const accessToken = generateAccessToken(user);
  // generate refresh token, put it into DB along with expiration timestamp
  const { refreshToken, expiresAt } = generateRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenExpiresAt = expiresAt;
  await user.save();
  res.render('authenticated', {
    accessToken,
    refreshToken,
    // TODO take origin from env
    origin: 'http://localhost:3000/signin'
  });
}

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
  const accessToken = generateAccessToken(user);
  const { refreshToken: newRefreshToken, expiresAt } = generateRefreshToken();
  user.refreshToken = newRefreshToken;
  user.refreshTokenExpiresAt = expiresAt;
  await user.save();
  res.json({ accessToken, refreshToken: newRefreshToken });
};
