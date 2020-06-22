import logger from './logger';
import dotenv from 'dotenv';

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

if (prod) {
  logger.debug(
    'Using .env.production file to supply config environment variables'
  );
  dotenv.config({ path: '.env.production' });
} else {
  logger.debug(
    'Using .env.development file to supply config environment variables'
  );
  dotenv.config({ path: '.env.development' });
}

export const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
  if (prod) {
    logger.error(
      'No mongo connection string. Set MONGODB_URI environment variable.'
    );
  } else {
    logger.error(
      'No mongo connection string. Set MONGODB_URI_LOCAL environment variable.'
    );
  }
  process.exit(1);
}
