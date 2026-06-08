import type { Request, Response } from 'express';
import Review from '../models/Review.js';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const where = isAdmin ? {} : { status: 'approved' };
    const reviews = await Review.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ data: review, message: 'Review submitted successfully and is pending approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = await Review.findByPk(id as string);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await review.update({ status });
    res.json({ data: review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id as string);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
