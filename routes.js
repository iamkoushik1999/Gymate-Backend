import { Router } from 'express';
const router = Router();
// Imports
import authRoutes from './routes/authRoutes.js';
// ------------------------------------------------------------

router.use('/api/v1/auth', authRoutes);

export default router;
