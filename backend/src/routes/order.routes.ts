import { Router } from 'express';
import { getAllOrders, getUserOrders, getDashboardStats, updateOrderStatus, deleteOrder, verifySession } from '../controllers/order.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Verify Stripe session (frontend success page polls this)
router.get('/verify-session', authenticateUser, verifySession);

// Order routes
router.get('/', getAllOrders);
router.get('/user', authenticateUser, getUserOrders);
router.get('/admin/stats', getDashboardStats);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
