import { Router } from 'express';
import apiRoutes from './api';

const routes = Router();

routes.use('/api/v0', apiRoutes);

export default routes;
