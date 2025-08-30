import {Router} from 'express';
import {getTasks, getTask, addTask, modifyTask, removeTask} from './controller.js';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', addTask);
router.patch('/:id', modifyTask);
router.delete('/:id', removeTask);

export default router;
