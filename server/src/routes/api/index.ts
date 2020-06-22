import { Router } from 'express';
import authRoutes from './auth.routes';
import { usersRouter } from './users.routes';
import { todosRouter } from './todos.routes';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/users', usersRouter);
apiRoutes.use('/todos', todosRouter);

export default apiRoutes;
