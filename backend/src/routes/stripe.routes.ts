import { Router } from 'express';
import { handleWebhook } from '../controllers/stripe.controller.js';

const router = Router();

router.post('/stripe', handleWebhook);

export default router;
