
import * as express from 'express';
import jwt from 'jsonwebtoken';

// FIX: Use `express.Request` to avoid conflict with global Request type.
// This resolves errors where properties like `headers` were not found.
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