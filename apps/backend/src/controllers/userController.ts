import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';

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
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real application, this would be protected by admin middleware
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      }
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('User ID is required', 400));
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id) {
      return next(new AppError('User ID is required', 400));
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return next(new AppError('User not found', 404));
    }

    // In a real application, you would check if the requesting user has permission to update this user
    // For example, only allow users to update their own profile or admin to update any profile

    // Check if email is being updated and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return next(new AppError('Email already in use', 400));
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('User ID is required', 400));
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return next(new AppError('User not found', 404));
    }

    // In a real application, you would check if the requesting user has permission to delete this user
    // For example, only allow admin to delete users or users to delete their own accounts

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('Not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is authorized to update this profile
    if (id !== userId && req.user?.role !== 'ADMIN') {
      return next(new AppError('You are not authorized to update this profile', 403));
    }

    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    // Get the user to update
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Delete old image if it exists
    if (user.image) {
      try {
        const oldImagePath = path.resolve(user.image.replace(/^\/uploads/, path.join(__dirname, '../../uploads')));
        if (fs.existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue even if old image deletion fails
      }
    }

    // Create relative path for storage in database
    const relativeFilePath = `/uploads/${id}/${req.file.filename}`;
    
    // Update user with new image path
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        image: relativeFilePath,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
