import { Response } from 'express';
import { pool } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getFiles = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const files = await pool.query('SELECT id, name, type, created_at FROM files WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(files.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching files' });
  }
};

export const getFileById = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        const file = await pool.query('SELECT * FROM files WHERE id = $1 AND user_id = $2', [id, userId]);
        if (file.rows.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.json(file.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching file' });
    }
};

export const createFile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, type, content } = req.body;
  
  if (!name || !type || !content) {
    return res.status(400).json({ message: 'Name, type, and content are required' });
  }

  try {
    const newFile = await pool.query(
      'INSERT INTO files (user_id, name, type, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, type, content]
    );
    res.status(201).json(newFile.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating file' });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const deleteOp = await pool.query('DELETE FROM files WHERE id = $1 AND user_id = $2', [id, userId]);
    if (deleteOp.rowCount === 0) {
        return res.status(404).json({ message: 'File not found or you do not have permission to delete it' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};
