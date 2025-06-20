import { Router } from 'express';
const router = Router();
// Controllers
import {
  createClass,
  deleteClass,
  getAllClasses,
  getSingleClass,
  updateClass,
} from '../controllers/classController.js';
// Middlewares
import { isAdmin, isAuthenticated } from '../middlewares/authMiddleware.js';
// Upload Middleware
import upload from '../middlewares/uploadMiddleware.js';

// ------------------------------------------------------------

// POST
router
  .route('/')
  .post(upload.single('image'), isAuthenticated, isAdmin, createClass);

// GET
router.route('/').get(getAllClasses);

// GET One
router.route('/:id').get(getSingleClass);

// PUT
router
  .route('/:id')
  .put(upload.single('image'), isAuthenticated, isAdmin, updateClass);

// DELETE
router.route('/:id').delete(isAuthenticated, isAdmin, deleteClass);

export default router;
