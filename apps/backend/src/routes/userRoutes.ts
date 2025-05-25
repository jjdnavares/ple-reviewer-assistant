import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUser, uploadProfileImage } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

export function userRoutes() {
  const router = Router();

  // Apply authentication middleware to all user routes
  router.use(authenticate);

  /**
   * @route GET /api/users/profile
   * @desc Get current user profile
   * @access Private
   */
  router.get('/profile', getCurrentUser);

  /**
   * @route GET /api/users
   * @desc Get all users
   * @access Private (Admin)
   */
  router.get('/', authorize('ADMIN'), getAllUsers);

  /**
   * @route GET /api/users/:id
   * @desc Get user by ID
   * @access Private
   */
  router.get('/:id', getUserById);

  /**
   * @route PUT /api/users/:id
   * @desc Update user
   * @access Private
   */
  router.put('/:id', updateUser);

  /**
   * @route DELETE /api/users/:id
   * @desc Delete user
   * @access Private (Admin or Own Account)
   */
  router.delete('/:id', deleteUser);

  /**
   * @route POST /api/users/:id/profile-image
   * @desc Upload profile image
   * @access Private
   */
  router.post('/:id/profile-image', upload.single('image'), uploadProfileImage);

  return router;
}
