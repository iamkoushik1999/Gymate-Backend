import { Router } from 'express';
const router = Router();

// Controllers
import {
  createTrainer,
  getAllTrainers,
  getSingleTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController.js';
// Middlewares
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
// Upload Middleware
import upload from '../middlewares/uploadMiddleware.js';

// ------------------------------------------------------------

// POST
router
  .route('/')
  .post(upload.single('image'), isAuthenticated, isAdmin, createTrainer);

// GET
router.route('/').get(getAllTrainers);

// GET
router.route('/:id').get(getSingleTrainer);

// PUT
router
  .route('/:id')
  .put(upload.single('image'), isAuthenticated, isAdmin, updateTrainer);

// DELETE
router.route('/:id').delete(isAuthenticated, isAdmin, deleteTrainer);

export default router;
