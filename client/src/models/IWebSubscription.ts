export interface IWebSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}
