import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VALID_SUBJECT,
  process.env.VALID_PUBLIC_KEY,
  process.env.VALID_PRIVATE_KEY
);
