import type { Request, Response } from 'express';
import Faq from '../models/Faq.js';

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const where = isAdmin ? {} : { isVisible: true };
    const faqs = await Faq.findAll({ where, order: [['order', 'ASC'], ['createdAt', 'DESC']] });
    res.json({ data: faqs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faqs' });
  }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ data: faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating faq' });
  }
};

export const updateFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id as string);
    if (!faq) return res.status(404).json({ message: 'Faq not found' });
    await faq.update(req.body);
    res.json({ data: faq });
  } catch (error) {
    res.status(500).json({ message: 'Error updating faq' });
  }
};

export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id as string);
    if (!faq) return res.status(404).json({ message: 'Faq not found' });
    await faq.destroy();
    res.json({ message: 'Faq deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faq' });
  }
};
