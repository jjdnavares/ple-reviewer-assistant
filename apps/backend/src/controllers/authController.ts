import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Ensure we use a single Prisma instance throughout the app
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Email, password and name are required', 400));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    // Create new user (password hashing would happen in a real implementation)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // In a real application, this would be hashed
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: 'success',
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and return token
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // In a real application, you would verify the password hash here
    // const isPasswordValid = await verifyPassword(password, user.password);
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate tokens (in a real application)
    const accessToken = 'mock-access-token';
    const refreshToken = 'mock-refresh-token';

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real application, you would invalidate the refresh token
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    // In a real application, you would verify the refresh token and generate a new access token
    const accessToken = 'new-mock-access-token';

    res.status(200).json({
      status: 'success',
      data: {
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link has been sent'
      });
    }

    // In a real application, you would generate a reset token and send an email
    const resetToken = 'mock-reset-token';

    res.status(200).json({
      status: 'success',
      message: 'If a user with that email exists, a password reset link has been sent',
      // Only included for development purposes
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(new AppError('Token and password are required', 400));
    }

    // In a real application, you would verify the token and update the user's password
    // const user = await prisma.user.update({
    //   where: { resetToken: token },
    //   data: { 
    //     password: hashedPassword,
    //     resetToken: null
    //   }
    // });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
