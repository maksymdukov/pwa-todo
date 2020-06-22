import { Router } from 'express';
import {
  getMyAndSharedTodos,
  getMyTodos,
  getSharedTodos,
  getTodo,
  postTodo,
  revokeTodoShare,
  shareTodo
} from '../../controllers/todo.controller';
import { isAuthenticated } from '../../middlewares/auth.middleware';

export const todosRouter = Router();

todosRouter.use(isAuthenticated);

todosRouter.get('/my', getMyTodos);
todosRouter.get('/all', getMyAndSharedTodos);
todosRouter.get('/shared', getSharedTodos);
todosRouter.post('/todo', postTodo);
todosRouter.get('/:todoId', getTodo);

todosRouter.post('/:todoId/share', shareTodo);
todosRouter.post('/:todoId/unshare', revokeTodoShare);
