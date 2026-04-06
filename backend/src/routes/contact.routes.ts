import { Router } from 'express';
import type { Request, Response } from 'express';
import Contact from '../models/Contact.js';

const router = Router();

// Submit a new contact form message
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        const newContact = await Contact.create({
            name,
            email,
            phone,
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: newContact
        });
    } catch (error: any) {
        console.error('Contact submission error:', error);
        res.status(500).json({ error: 'Internal server error while sending message.' });
    }
});

// Admin: Get all contact messages
router.get('/', async (req: Request, res: Response) => {
    try {
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(contacts);
    } catch (error: any) {
        console.error('Failed to fetch contacts:', error);
        res.status(500).json({ error: 'Internal server error while fetching contacts.' });
    }
});

// Admin: Delete a contact message
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const contact = await Contact.findByPk(id);
        
        if (!contact) {
            return res.status(404).json({ error: 'Contact message not found.' });
        }

        await contact.destroy();
        res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (error: any) {
        console.error('Failed to delete contact:', error);
        res.status(500).json({ error: 'Internal server error while deleting message.' });
    }
});

export default router;
