import { Router } from 'express';
import { 
  uploadPDF,
  getPDFDocuments,
  getPDFDocumentById,
  deletePDFDocument,
  processDocument,
  vectorizeDocument
} from '../controllers/pdfController';
import { auth } from '../middlewares/auth';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export function pdfRoutes() {
  const router = Router();

  /**
   * @route POST /api/pdfs/upload
   * @desc Upload a new PDF document
   * @access Private (Admin only)
   */
  router.post('/upload', auth, upload.single('file'), uploadPDF);

  /**
   * @route GET /api/pdfs
   * @desc Get all PDF documents
   * @access Private (Admin only)
   */
  router.get('/', auth, getPDFDocuments);

  /**
   * @route GET /api/pdfs/:id
   * @desc Get PDF document by ID
   * @access Private (Admin only)
   */
  router.get('/:id', auth, getPDFDocumentById);

  /**
   * @route DELETE /api/pdfs/:id
   * @desc Delete PDF document
   * @access Private (Admin only)
   */
  router.delete('/:id', auth, deletePDFDocument);

  /**
   * @route POST /api/pdfs/:id/process
   * @desc Extract questions and answers from PDF
   * @access Private (Admin only)
   */
  router.post('/:id/process', auth, processDocument);

  /**
   * @route POST /api/pdfs/:id/vectorize
   * @desc Create vector embeddings for PDF content
   * @access Private (Admin only)
   */
  router.post('/:id/vectorize', auth, vectorizeDocument);

  return router;
}
