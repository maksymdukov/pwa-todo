import { Router } from 'express';
import {
  getMyAndSharedTodos,
  getMyTodos,
  getSharedTodos,
  getTodo,
  postTodo,
  revokeTodoShare,
  shareTodo,
  editTodo,
  deleteTodo,
  getChanges,
} from '../../controllers/todo.controller';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { validatePagination } from '../../middlewares/validators';
import { validateInput } from '../../middlewares/validate-input';
import { body, param } from 'express-validator';

export const todosRouter = Router();

todosRouter.use(isAuthenticated);

todosRouter.get('/my', getMyTodos);
todosRouter.get('/all', validatePagination, validateInput, getMyAndSharedTodos);
todosRouter.get('/shared', getSharedTodos);
todosRouter.post(
  '/todo',
  [
    body('title').isLength({ min: 0 }),
    body('records.*.id').isISO8601(),
    body('records.*.done').isBoolean(),
    body('records.*.content').isLength({ min: 1 }),
  ],
  validateInput,
  postTodo
);
todosRouter.get('/:todoId', getTodo);
todosRouter.patch(
  '/:todoId',
  [
    body('title').isLength({ min: 0 }),
    body('records.*.id').isISO8601(),
    body('records.*.done').isBoolean(),
    body('records.*.content').isLength({ min: 1 }),
  ],
  validateInput,
  editTodo
);
todosRouter.delete(
  '/:todoId',
  [param('todoId').isMongoId()],
  validateInput,
  deleteTodo
);

todosRouter.post(
  '/:todoId/share',
  [param('todoId').isMongoId()],
  validateInput,
  shareTodo
);
todosRouter.post(
  '/:todoId/unshare',
  [param('todoId').isMongoId()],
  validateInput,
  revokeTodoShare
);

todosRouter.post(
  '/changes',
  [body('lastTimeUpdated').isInt({ min: 0 })],
  validateInput,
  getChanges
);
