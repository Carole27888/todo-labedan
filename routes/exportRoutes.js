import express from 'express';
import { exportTasksToExcel, exportTasksToPDF } from '../controllers/exportController.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();

router.get('/tasks/excel', exportTasksToExcel);
router.get('/tasks/pdf', exportTasksToPDF);
router.get('/tasks/excel', requireRole(['admin', 'user']), exportTasksToExcel);

export default router;
