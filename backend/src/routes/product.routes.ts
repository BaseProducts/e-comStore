import { Router } from 'express';
import type { Request, Response } from 'express';
import Product from '../models/Product.js';
import { upload, uploadToCloudinary } from '../middleware/upload.middleware.js';

const router = Router();

// Create a new product with multiple images
router.post('/', upload.array('images'), async (req: Request, res: Response) => {
    try {
        const { name, description, price, discountPrice, category, gender, stock, isFeatured, sizes } = req.body;
        
        const files = req.files as Express.Multer.File[];
        const imageUrls: string[] = [];

        if (files && files.length > 0) {
            // Upload all images to Cloudinary
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...uploadedUrls);
        }

        let parsedSizes: string[] = [];
        if (sizes) {
            try {
                parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            } catch (e) {
                parsedSizes = Array.isArray(sizes) ? sizes : [sizes];
            }
        }

        const newProduct = await Product.create({
            name,
            description,
            price: parseFloat(price),
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            category,
            gender,
            stock: parseInt(stock) || 0,
            isFeatured: isFeatured === 'true',
            imageUrls,
            sizes: parsedSizes
        });

        res.status(201).json(newProduct);
    } catch (error: any) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product by id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle product visibility
router.patch('/:id/toggle-visibility', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isVisible = !product.isVisible;
        await product.save();

        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', upload.array('images'), async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, description, price, discountPrice, category, gender, stock, isFeatured, sizes, existingImages } = req.body;
        
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const files = req.files as Express.Multer.File[];
        const imageUrls: string[] = [];

        // Add back existing images if provided
        if (existingImages) {
            try {
                const parsedExisting = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
                imageUrls.push(...(Array.isArray(parsedExisting) ? parsedExisting : [parsedExisting]));
            } catch (e) {
                console.error("Error parsing existing images:", e);
            }
        }

        if (files && files.length > 0) {
            // Upload new images to Cloudinary
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const uploadedUrls = await Promise.all(uploadPromises);
            imageUrls.push(...uploadedUrls);
        }

        let parsedSizes: string[] = [];
        if (sizes) {
            try {
                parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            } catch (e) {
                parsedSizes = Array.isArray(sizes) ? sizes : [sizes];
            }
        }

        await product.update({
            name,
            description,
            price: price ? parseFloat(price) : product.price,
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            category,
            gender,
            stock: stock ? parseInt(stock) : product.stock,
            isFeatured: isFeatured === 'true',
            imageUrls: imageUrls.length > 0 ? imageUrls : product.imageUrls,
            sizes: parsedSizes.length > 0 ? parsedSizes : product.sizes
        });

        res.status(200).json(product);
    } catch (error: any) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
