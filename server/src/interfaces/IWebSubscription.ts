export interface WebSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}
