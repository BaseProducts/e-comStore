import { Router } from 'express';
import type { Request, Response } from 'express';
import User from '../models/User.js';

const router = Router();

// Admin: Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error: any) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ error: 'Internal server error while fetching users.' });
    }
});

// Admin: Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Optional: Block deleting admins if needed, but not strictly required.
        // if (user.role === 'admin') { return res.status(403).json() }

        await user.destroy();
        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error: any) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ error: 'Internal server error while deleting user.' });
    }
});

export default router;
