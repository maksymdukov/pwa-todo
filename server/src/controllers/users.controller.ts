import { Response, Request } from 'express';
import { WebSubscription } from '../interfaces/IWebSubscription';
import { User } from '../models/User';

export const checkWebPushSubscription = async (req: Request, res: Response) => {
  const { endpoint } = req.query as { endpoint: string };
  console.log('endpoint', endpoint);

  const found = req.user.webSubscriptions.find(
    (websub) => websub.endpoint === endpoint
  );
  res.status(found ? 200 : 400).send();
};

export const addWebPushSubscription = async (req: Request, res: Response) => {
  const subscription: WebSubscription = req.body;
  req.user.webSubscriptions.push(subscription);
  await req.user.save();
  res.end();
};

export const removeWebPushSubscription = async (
  req: Request,
  res: Response
) => {
  const subscription: WebSubscription = req.body;
  const response = await User.removeSubscription(
    req.user.id,
    subscription.endpoint
  );
  res.end();
};

export const getUsers = async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };
  const users = await User.getUsers({ email });
  res.json(users);
};

export const getProfile = async (req: Request, res: Response) => {
  console.log('user', req.user);
  res.json(req.user);
};
