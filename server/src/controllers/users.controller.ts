import { Response } from 'express';
import { RequestWithUser } from '../interfaces/IResponse';
import { WebSubscription } from '../interfaces/IWebSubscription';

export const addWebPushSubscription = async (
  req: RequestWithUser,
  res: Response
) => {
  const subscription: WebSubscription = req.body;
  req.user.webSubscriptions.push(subscription);
  await req.user.save();
  res.end();
};
