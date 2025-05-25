import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword, resetPassword } from '../controllers/authController';

export function authRoutes() {
  const router = Router();

  /**
   * @route POST /api/auth/register
   * @desc Register a new user
   * @access Public
   */
  router.post('/register', register);

  /**
   * @route POST /api/auth/login
   * @desc Login user and return token
   * @access Public
   */
  router.post('/login', login);

  /**
   * @route POST /api/auth/logout
   * @desc Logout user
   * @access Private
   */
  router.post('/logout', logout);

  /**
   * @route POST /api/auth/refresh
   * @desc Refresh access token
   * @access Public (with refresh token)
   */
  router.post('/refresh', refreshToken);

  /**
   * @route POST /api/auth/forgot-password
   * @desc Request password reset
   * @access Public
   */
  router.post('/forgot-password', forgotPassword);

  /**
   * @route POST /api/auth/reset-password
   * @desc Reset password with token
   * @access Public (with reset token)
   */
  router.post('/reset-password', resetPassword);

  return router;
}
