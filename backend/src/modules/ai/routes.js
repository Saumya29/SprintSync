import {Router} from 'express';
import {getTaskDescription} from './controller.js';
import {auth} from '../../middleware/auth.js';

const router = Router();

router.post('/suggest', auth, getTaskDescription);

export default router;
