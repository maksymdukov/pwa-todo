import { Response, Request } from 'express';
import { WebSubscription } from '../interfaces/IWebSubscription';

export const addWebPushSubscription = async (req: Request, res: Response) => {
  const subscription: WebSubscription = req.body;
  req.user.webSubscriptions.push(subscription);
  await req.user.save();
  res.end();
};
