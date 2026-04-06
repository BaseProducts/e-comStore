import { Router } from 'express';
import { createOrder, getAllOrders, getUserOrders, getDashboardStats, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

// Order routes (Public for dev admin access)
router.post('/', authenticateUser, createOrder); // Still require login to BUY
router.get('/', getAllOrders);
router.get('/user', authenticateUser, getUserOrders);
router.get('/admin/stats', getDashboardStats);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
