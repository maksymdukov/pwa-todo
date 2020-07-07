import webpush from 'web-push';
import { WebSubscription } from '../interfaces/IWebSubscription';
import { config } from '../config';

webpush.setVapidDetails(
  `mailto:${config.VAPID_SUBJECT}`,
  config.VAPID_PUBLIC_KEY,
  config.VAPID_PRIVATE_KEY
);

export const sendWebPushNotification = (
  pushCnf: WebSubscription,
  data: unknown
) => {
  return webpush.sendNotification(pushCnf, JSON.stringify(data));
};
