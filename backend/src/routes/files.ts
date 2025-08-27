import { Router } from 'express';
import { getFiles, getFileById, createFile, deleteFile } from '../controllers/fileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getFiles);
router.get('/:id', getFileById);
router.post('/', createFile);
router.delete('/:id', deleteFile);

export default router;
