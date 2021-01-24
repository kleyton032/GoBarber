import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddlewares from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

const routes = new Router();
const upload = multer(multerConfig);

//create user
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddlewares);
routes.put('/users', UserController.update);
routes.post('/file', upload.single('file'), FileController.store);
routes.get('/providers', ProviderController.index);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);

routes.get('/schedule', ScheduleController.index);


export default routes;
