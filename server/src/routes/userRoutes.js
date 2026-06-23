import { Router } from 'express';
import { changePassword, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
const router = Router(); router.use(protect); router.patch('/profile', updateProfile); router.patch('/password', changePassword); export default router;
