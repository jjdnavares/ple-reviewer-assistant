import { Router } from 'express';
import { 
  getExams, 
  getExamById, 
  createExam, 
  updateExam, 
  deleteExam,
  startExam,
  submitExam,
  getExamAttempts,
  getExamAttemptById
} from '../controllers/examController';
import { auth } from '../middlewares/auth';

export function examRoutes() {
  const router = Router();

  /**
   * @route GET /api/exams
   * @desc Get all exams (with filtering options)
   * @access Private
   */
  router.get('/', auth, getExams);

  /**
   * @route GET /api/exams/:id
   * @desc Get exam by ID
   * @access Private
   */
  router.get('/:id', auth, getExamById);

  /**
   * @route POST /api/exams
   * @desc Create a new exam
   * @access Private (Admin only)
   */
  router.post('/', auth, createExam);

  /**
   * @route PUT /api/exams/:id
   * @desc Update an exam
   * @access Private (Admin only)
   */
  router.put('/:id', auth, updateExam);

  /**
   * @route DELETE /api/exams/:id
   * @desc Delete an exam
   * @access Private (Admin only)
   */
  router.delete('/:id', auth, deleteExam);

  /**
   * @route POST /api/exams/:id/start
   * @desc Start an exam attempt
   * @access Private
   */
  router.post('/:id/start', auth, startExam);

  /**
   * @route POST /api/exams/:id/submit
   * @desc Submit an exam attempt
   * @access Private
   */
  router.post('/:id/submit', auth, submitExam);

  /**
   * @route GET /api/exams/:id/attempts
   * @desc Get all attempts for an exam
   * @access Private (Admin only)
   */
  router.get('/:id/attempts', auth, getExamAttempts);

  /**
   * @route GET /api/exams/attempts/:attemptId
   * @desc Get exam attempt by ID
   * @access Private
   */
  router.get('/attempts/:attemptId', auth, getExamAttemptById);

  return router;
}
