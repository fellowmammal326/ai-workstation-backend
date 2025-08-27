import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// FIX: Changed interface to a type intersection to resolve property existence errors in controllers.
// The original `interface AuthRequest extends Request` was not correctly inheriting properties
// like `body`, `params`, and `headers` in the project's TypeScript environment.
export type AuthRequest = Request & {
  user?: { id: number };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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
