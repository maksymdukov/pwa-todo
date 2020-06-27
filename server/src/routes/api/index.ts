import { Router } from 'express';
import authRoutes from './auth.routes';
import { usersRouter } from './users.routes';
import { todosRouter } from './todos.routes';
import { checkStatus } from '../../controllers/status.controller';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/users', usersRouter);
apiRoutes.use('/todos', todosRouter);

apiRoutes.get('/status', checkStatus);

export default apiRoutes;
