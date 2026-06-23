import { Router } from 'express';
import { dashboard } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
const router = Router(); router.use(protect); router.get('/dashboard', dashboard); export default router;
