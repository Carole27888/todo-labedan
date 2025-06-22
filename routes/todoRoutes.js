import express from 'express';
import { requireRole } from '../middlewares/roleMiddleware.js';
import {
  createTodo,
  getTodos,
  updateTodo,
  toggleComplete,
  deleteTodo
} from '../controllers/todoController.js';

const router = express.Router();

// Allow admin + user to create, update, toggle, delete
router.post('/', requireRole(['admin', 'user']), createTodo);
router.get('/', getTodos);
router.put('/:id', requireRole(['admin', 'user']), updateTodo);
router.patch('/:id/complete', requireRole(['admin', 'user']), toggleComplete);
router.delete('/:id', requireRole(['admin', 'user']), deleteTodo);

export default router;
