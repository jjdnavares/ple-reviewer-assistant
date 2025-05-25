import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { prisma } from 'database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('Authentication token missing', 401));
    }
    
    // In a real implementation, you would verify the JWT token here
    // and extract the user ID from it
    // For now, we'll use a placeholder implementation
    
    // This is a placeholder - in production, use a proper JWT verification
    const userId = 'placeholder'; // This would come from JWT verification
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    return next(new AppError('Authentication failed', 401));
  }
};

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this resource', 403));
    }
    
    next();
  };
};
