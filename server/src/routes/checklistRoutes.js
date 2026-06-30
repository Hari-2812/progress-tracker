import { Router } from 'express';
import { getChecklist, addTopic, updateTopic, deleteTopic } from '../controllers/checklistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/', getChecklist);
router.post('/', addTopic);
router.patch('/:id', updateTopic);
router.delete('/:id', deleteTopic);

export default router;
