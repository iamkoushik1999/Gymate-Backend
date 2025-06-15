import { Router } from 'express';
const router = Router();
// Controllers
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  deleteContactUs,
} from '../controllers/contactusController.js';
// Middlewares
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

// ------------------------------------------------------------

// POST
router.route('/').post(createContactUs);

// GET
router.route('/').get(isAuthenticated, isAdmin, getAllContactUs);

// GET
router.route('/:id').get(isAuthenticated, isAdmin, getContactUsById);

// DELETE
router.route('/:id').delete(isAuthenticated, isAdmin, deleteContactUs);

export default router;
