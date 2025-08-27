import { Router } from 'express';
import { chatWithAI, generateImage } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/chat', chatWithAI);
router.post('/generate-image', generateImage);


export default router;
