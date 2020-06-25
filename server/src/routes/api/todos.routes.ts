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

export const todosRouter = Router();

todosRouter.use(isAuthenticated);

todosRouter.get('/my', getMyTodos);
todosRouter.get('/all', validatePagination, validateInput, getMyAndSharedTodos);
todosRouter.get('/shared', getSharedTodos);
todosRouter.post('/todo', postTodo);
todosRouter.get('/:todoId', getTodo);
todosRouter.patch('/:todoId', editTodo);
todosRouter.delete('/:todoId', deleteTodo);

todosRouter.post('/:todoId/share', shareTodo);
todosRouter.post('/:todoId/unshare', revokeTodoShare);

todosRouter.post('/changes', getChanges);
