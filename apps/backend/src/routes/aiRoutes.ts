import { Router } from 'express';
import { 
  askQuestion,
  generateExplanation,
  getRelatedContent,
  getQuestionHints
} from '../controllers/aiController';
import { auth } from '../middlewares/auth';

export function aiRoutes() {
  const router = Router();

  /**
   * @route POST /api/ai/ask
   * @desc Ask a question to the AI assistant
   * @access Private
   */
  router.post('/ask', auth, askQuestion);

  /**
   * @route POST /api/ai/explain
   * @desc Generate an explanation for a question or concept
   * @access Private
   */
  router.post('/explain', auth, generateExplanation);

  /**
   * @route GET /api/ai/related-content
   * @desc Get content related to a topic or question
   * @access Private
   */
  router.get('/related-content', auth, getRelatedContent);

  /**
   * @route POST /api/ai/hints
   * @desc Get hints for a question without revealing the answer
   * @access Private
   */
  router.post('/hints', auth, getQuestionHints);

  return router;
}
