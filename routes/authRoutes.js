import { Router } from 'express';
const router = Router();
// Controllers
import { login, signup } from '../controllers/authController.js';

// ------------------------------------------------------------

// POST
router.route('/sign-up').post(signup);

// POST
router.route('/login').post(login);

export default router;
