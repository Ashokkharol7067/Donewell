import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { stats } from '../controllers/dashboardController.js';
const router = express.Router();
router.get('/stats', protect, stats);
export default router;
