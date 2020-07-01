import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import {
  validatePagination,
  validateArrayOfMongoIds,
} from '../../middlewares/validators';
import { validateInput } from '../../middlewares/validate-input';
import {
  getUnreadNotifcations,
  getReadNotifcations,
  markNotificationsRead,
} from '../../controllers/notifications.controller';

export const notificationRouter = Router();

notificationRouter.use(isAuthenticated);

notificationRouter.get(
  '/unread',
  validatePagination,
  validateInput,
  getUnreadNotifcations
);

notificationRouter.get(
  '/read',
  validatePagination,
  validateInput,
  getReadNotifcations
);

notificationRouter.patch(
  '/markread',
  validateArrayOfMongoIds,
  validateInput,
  markNotificationsRead
);
