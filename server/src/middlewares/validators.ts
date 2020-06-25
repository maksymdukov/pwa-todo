import { query } from 'express-validator';

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }),
  query('size').optional().isInt({ min: 2, max: 100 }),
];
