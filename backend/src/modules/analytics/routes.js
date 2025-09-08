import {Router} from 'express';
import {getTimeLoggedPerDay} from './controller.js';

const router = Router();

router.get('/time-logged', getTimeLoggedPerDay);

export default router;
