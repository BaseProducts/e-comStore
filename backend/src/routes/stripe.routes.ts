import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripe.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Create a Stripe Checkout Session (requires login)
router.post('/create-session', authenticateUser, createCheckoutSession);

// Stripe Webhook (raw body, no auth — Stripe sends this directly)
// Full Path: /api/stripe/webhook
router.post('/webhook', handleWebhook);

export default router;
