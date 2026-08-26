import express from 'express';
import protect from '../middleware/authMiddleware.js';
import * as controller from '../controllers/taskController.js';
const router = express.Router();
router.use(protect);
router.route('/').get(controller.list).post(controller.create);
router.route('/:id').get(controller.getOne).put(controller.update).delete(controller.remove);
export default router;
