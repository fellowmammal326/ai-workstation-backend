

// FIX: Alias express types to avoid conflicts with global types.
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// FIX: Extended aliased `ExpressRequest` to avoid conflict with global Request type.
export interface AuthRequest extends ExpressRequest {
  user?: { id: number };
}

export const authMiddleware = (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
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