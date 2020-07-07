import { Request, Response } from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../config/authentication/token';
import { User } from '../models/User';
import { config } from '../config';

export async function generateUserTokens(req: Request, res: Response) {
  const user = req.user;
  const accessToken = generateAccessToken(user);
  // generate refresh token, put it into DB along with expiration timestamp
  const { refreshToken, expiresAt } = generateRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenExpiresAt = expiresAt;
  await user.save();
  res.render('authenticated', {
    accessToken,
    refreshToken,
    origin: `${config.PUBLIC_URL}/signin`,
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
