import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Everyone can get settings (for checkout) 
router.get('/', getSettings);

// Update settings (Admin Panel)
router.put('/', updateSettings);

export default router;
