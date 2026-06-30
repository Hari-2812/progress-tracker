import { Router } from 'express';
import { getChecklist, addTopic, updateTopic, deleteTopic } from '../controllers/checklistController.js';
import { protect } from '../middleware/auth.js';

console.log('Checklist routes file loaded successfully.');

const router = Router();

router.get('/test-unprotected', (req, res) => res.json({ success: true, message: 'Router is successfully mounted and reachable without protect middleware.' }));

router.use(protect);
router.get('/', getChecklist);
router.post('/', addTopic);
router.patch('/:id', updateTopic);
router.delete('/:id', deleteTopic);

export default router;
