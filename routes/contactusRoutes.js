import { Router } from 'express';
const router = Router();
// Controllers
import {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  deleteContactUs,
} from '../controllers/contactusController.js';

// ------------------------------------------------------------

// POST
router.route('/').post(createContactUs);

// GET
router.route('/').get(getAllContactUs);

// GET
router.route('/:id').get(getContactUsById);

// DELETE
router.route('/:id').delete(deleteContactUs);

export default router;
