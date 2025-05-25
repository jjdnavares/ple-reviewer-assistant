import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { authRoutes } from './authRoutes';
import { examRoutes } from './examRoutes';
import { questionRoutes } from './questionRoutes';
import { subjectRoutes } from './subjectRoutes';
import { pdfRoutes } from './pdfRoutes';
import { aiRoutes } from './aiRoutes';

export function createRoutes() {
  const router = Router();

  // Health check route
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // Mount API routes
  router.use('/auth', authRoutes());
  router.use('/users', userRoutes());
  router.use('/exams', examRoutes());
  router.use('/questions', questionRoutes());
  router.use('/subjects', subjectRoutes());
  router.use('/pdfs', pdfRoutes());
  router.use('/ai', aiRoutes());

  return router;
}
