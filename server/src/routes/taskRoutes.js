import { Router } from 'express';
import { archiveTask, createTask, dayDetails, setCompletion, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router(); router.use(protect);
router.post('/', createTask); router.get('/day/:date', dayDetails); router.patch('/:id', updateTask); router.delete('/:id', archiveTask); router.patch('/:id/completion', setCompletion);
export default router;
