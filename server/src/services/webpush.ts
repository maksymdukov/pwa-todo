import webpush from 'web-push';
import { WebSubscription } from '../interfaces/IWebSubscription';

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_SUBJECT}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendWebPushNotification = (
  pushCnf: WebSubscription,
  data: unknown
) => {
  return webpush.sendNotification(pushCnf, JSON.stringify(data));
};
