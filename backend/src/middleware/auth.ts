import express from 'express';
import jwt from 'jsonwebtoken';

// FIX: Correctly extend express.Request using an interface to avoid type conflicts with
// global types and ensure properties like `headers`, `body`, and `params` are available.
export interface AuthRequest extends express.Request {
  user?: { id: number };
}

export const authMiddleware = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
