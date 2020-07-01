import { query, body } from 'express-validator';

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }),
  query('size').optional().isInt({ min: 2, max: 100 }),
];

export const validateArrayOfMongoIds = [
  body('ids').isArray({ min: 1, max: 100 }),
  body('ids.*').isMongoId(),
];
