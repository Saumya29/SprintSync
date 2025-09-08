import {Router} from 'express';
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/users/routes.js';
import taskRoutes from './modules/tasks/routes.js';
import aiRoutes from './modules/ai/routes.js';
import analyticsRoutes from './modules/analytics/routes.js';
import {auth} from './middleware/auth.js';

const router = Router();

router.use('/auth', authRoutes);

router.use(auth);

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
