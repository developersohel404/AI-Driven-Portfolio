import { Router } from 'express';
import { llmsController } from './llms.controller';

export const discoverRouter = Router();

discoverRouter.get('/llms.txt', llmsController.index);
