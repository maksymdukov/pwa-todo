import dotenv from 'dotenv';
import { isDev } from '../util/env';

if (isDev) {
  dotenv.config({ path: '.env.development' });
}

export const config: { [k: string]: string } = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  VAPID_SUBJECT: process.env.VAPID_SUBJECT,
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  PUBLIC_URL: process.env.PUBLIC_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const exceptions = ['PORT'];

(() => {
  Object.keys(config).forEach((key) => {
    if (!exceptions.includes(key) && !config[key]) {
      throw new Error(`${key} env variable is required`);
    }
  });
})();
