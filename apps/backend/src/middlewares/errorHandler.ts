import { Request, Response, NextFunction } from 'express';

// Define custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  
  // Check if it's our custom error
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    // Handle authorization errors
    statusCode = 401;
    message = 'Unauthorized';
  }

  // Log error in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
    console.error(err.stack);
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    stack,
    timestamp: new Date().toISOString()
  });
};
