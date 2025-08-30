import {Router} from 'express';
import {getUsers, getUser, updateUser, removeUser} from './controller.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', removeUser);

export default router;
