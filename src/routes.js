import { Router } from 'express';
import authMiddlewares from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

//create user
routes.post('/users', UserController.store);
routes.put('/users', authMiddlewares, UserController.update);
routes.post('/session', SessionController.store);

export default routes;
