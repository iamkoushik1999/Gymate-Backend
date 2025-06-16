import { Router } from 'express';
const router = Router();
// Imports
import authRoutes from './routes/authRoutes.js';
import contactUsRoutes from './routes/contactusRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
// ------------------------------------------------------------

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/contactus', contactUsRoutes);
router.use('/api/v1/gallery', galleryRoutes);

export default router;
