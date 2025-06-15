import { Router } from 'express';
const router = Router();
// Controllers
import { login, profile, signup } from '../controllers/authController.js';
// Middlewares
import { isAuthenticated } from '../middlewares/authMiddleware.js';

// ------------------------------------------------------------

// POST
router.route('/sign-up').post(signup);

// POST
router.route('/login').post(login);

// GET
router.route('/profile').get(isAuthenticated, profile);

export default router;
