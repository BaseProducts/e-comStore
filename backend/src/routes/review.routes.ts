import express from 'express';
import { getReviews, createReview, updateReviewStatus, deleteReview } from '../controllers/review.controller.js';


const router = express.Router();

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

export default router;
