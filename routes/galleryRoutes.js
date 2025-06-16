import { Router } from 'express';
const router = Router();
// Controllers
import {
  deleteGallery,
  getAllGallery,
  uploadGallery,
  uploadMultipleGallery,
} from '../controllers/galleryController.js';
// Middlewares
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

// ------------------------------------------------------------

// POST
router
  .route('/single')
  .post(upload.single('image'), isAuthenticated, isAdmin, uploadGallery);

// POST
router
  .route('/multiple')
  .post(
    isAuthenticated,
    isAdmin,
    upload.array('images'),
    uploadMultipleGallery
  );

// GET
router.route('/').get(getAllGallery);

// DELETE
router.route('/:id').delete(isAuthenticated, isAdmin, deleteGallery);

export default router;
