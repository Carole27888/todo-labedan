import express from 'express';
import { requireRole } from '../middlewares/roleMiddleware.js';
import {
  createTask,
  getTasks,
  updateTask,
  toggleTaskComplete,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// Allow admin + user to create, update, toggle, delete
router.post('/', requireRole(['admin', 'user']), createTask);
router.get('/', getTasks);
router.put('/:id', requireRole(['admin', 'user']), updateTask);
router.patch('/:id/complete', requireRole(['admin', 'user']), toggleTaskComplete);
router.delete('/:id', requireRole(['admin', 'user']), deleteTask);

export default router;
