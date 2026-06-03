import { Router } from 'express';
import type { Request, Response } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { upload, uploadToCloudinary } from '../middleware/upload.middleware.js';

const router = Router();

// Everyone can get settings (for checkout) 
router.get('/', getSettings);

// Update settings (Admin Panel)
router.put('/', updateSettings);

// Upload a single image for settings (e.g. banners)
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });
        
        const url = await uploadToCloudinary(file.buffer);
        res.status(200).json({ url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
