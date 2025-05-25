import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from 'database';
import { createClient } from 'minio';
import * as pdfParse from 'pdf-parse';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from '@langchain/openai';

// Initialize MinIO client
const minioClient = createClient({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Initialize OpenAI client
const openai = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4-turbo',
  temperature: 0.1,
});

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Upload a PDF document
 */
export const uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const file = req.file;
    const { title } = req.body;

    if (!title) {
      return next(new AppError('Title is required', 400));
    }

    // Generate a unique filename
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const bucketName = process.env.MINIO_BUCKET_NAME || 'ple-reviewer';
    
    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }
    
    // Upload file to MinIO
    await minioClient.putObject(
      bucketName,
      filename,
      file.buffer,
      file.size,
      { 'Content-Type': 'application/pdf' }
    );
    
    // Parse PDF to get page count
    const pdfData = await pdfParse(file.buffer);
    const pageCount = pdfData.numpages;
    
    // Create database record
    const pdfDocument = await prisma.pDFDocument.create({
      data: {
        title,
        filename,
        path: `${bucketName}/${filename}`,
        size: file.size,
        pages: pageCount,
        processed: false,
        vectorized: false,
      },
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        document: pdfDocument,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all PDF documents
 */
export const getPDFDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documents = await prisma.pDFDocument.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a PDF document by ID
 */
export const getPDFDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const document = await prisma.pDFDocument.findUnique({
      where: { id },
    });
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a PDF document
 */
export const deletePDFDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const document = await prisma.pDFDocument.findUnique({
      where: { id },
    });
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Delete from MinIO
    const [bucketName, objectName] = document.path.split('/');
    await minioClient.removeObject(bucketName, objectName);
    
    // Delete from database
    await prisma.pDFDocument.delete({
      where: { id },
    });
    
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process a PDF document to extract questions and answers
 */
export const processDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { subjectId } = req.body;
    
    if (!subjectId) {
      return next(new AppError('Subject ID is required', 400));
    }
    
    const document = await prisma.pDFDocument.findUnique({
      where: { id },
    });
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Get the file from MinIO
    const [bucketName, objectName] = document.path.split('/');
    
    // Stream the file and convert to buffer
    let fileBuffer: Buffer;
    try {
      const fileStream = await minioClient.getObject(bucketName, objectName);
      
      // Convert stream to buffer
      const chunks: any[] = [];
      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }
      fileBuffer = Buffer.concat(chunks);
    } catch (error) {
      return next(new AppError('Error retrieving file from storage', 500));
    }
    
    // Parse PDF
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;
    
    // Extract questions using AI
    const questions = await extractQuestionsFromText(text, subjectId);
    
    // Save questions to database
    const savedQuestions = await saveQuestions(questions, subjectId);
    
    // Mark document as processed
    await prisma.pDFDocument.update({
      where: { id },
      data: {
        processed: true,
      },
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        questionsExtracted: savedQuestions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create vector embeddings for a PDF document
 */
export const vectorizeDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const document = await prisma.pDFDocument.findUnique({
      where: { id },
    });
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Get questions related to this document
    const questions = await prisma.question.findMany({
      where: {
        sourceId: id,
      },
      include: {
        options: true,
      },
    });
    
    if (questions.length === 0) {
      return next(new AppError('No questions found for this document. Process the document first.', 400));
    }
    
    // Create embeddings for each question
    for (const question of questions) {
      // Prepare content for embedding
      const content = `
        Question: ${question.text}
        
        Options:
        ${question.options.map(opt => `- ${opt.text}${opt.isCorrect ? ' (correct)' : ''}`).join('\n')}
        
        Explanation:
        ${question.explanation || 'No explanation provided.'}
      `;
      
      // Create embedding
      const embedding = await embeddings.embedQuery(content);
      
      // In production, you would store this embedding in a vector database like Pinecone
      // For now, we'll just update the question with a marker
      await prisma.question.update({
        where: { id: question.id },
        data: {
          vectorId: `embedding_${Date.now()}`, // Placeholder for real vector ID
        },
      });
    }
    
    // Mark document as vectorized
    await prisma.pDFDocument.update({
      where: { id },
      data: {
        vectorized: true,
      },
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        questionsVectorized: questions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function extractQuestionsFromText(text: string, subjectId: string) {
  try {
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000,
      chunkOverlap: 200,
    });
    
    const chunks = await textSplitter.splitText(text);
    
    // Process each chunk to extract questions
    const allExtractedQuestions: any[] = [];
    
    for (const chunk of chunks) {
      const prompt = `
        Extract multiple-choice questions from the following medical text.
        Format each question as JSON with the following structure:
        
        {
          "text": "The question text",
          "options": [
            {"text": "Option A", "isCorrect": false},
            {"text": "Option B", "isCorrect": true},
            {"text": "Option C", "isCorrect": false},
            {"text": "Option D", "isCorrect": false}
          ],
          "explanation": "Explanation of why the correct answer is correct",
          "difficulty": "EASY|MEDIUM|HARD",
          "tags": ["tag1", "tag2"]
        }
        
        Only extract questions if they are clear and complete with options and a clear correct answer.
        Return the result as a JSON array of questions. If no valid questions are found, return an empty array.
        
        TEXT:
        ${chunk}
      `;
      
      // Call OpenAI API
      const response = await openai.invoke(prompt);
      
      try {
        // Parse the response
        const extractedText = response.trim();
        
        // Find JSON content in the response (in case the model adds extra text)
        const jsonMatch = extractedText.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          
          if (Array.isArray(parsedQuestions)) {
            allExtractedQuestions.push(...parsedQuestions);
          }
        }
      } catch (parseError) {
        console.error('Error parsing extracted questions:', parseError);
        // Continue with next chunk
      }
    }
    
    return allExtractedQuestions;
  } catch (error) {
    console.error('Error extracting questions:', error);
    throw new AppError('Failed to extract questions from document', 500);
  }
}

async function saveQuestions(questions: any[], subjectId: string) {
  const savedQuestions = [];
  
  for (const question of questions) {
    try {
      // Create the question
      const newQuestion = await prisma.question.create({
        data: {
          text: question.text,
          explanation: question.explanation,
          difficulty: question.difficulty || 'MEDIUM',
          subjectId,
          tags: question.tags || [],
          // Don't specify correctOptionId yet
        },
      });
      
      // Create options
      for (const option of question.options) {
        await prisma.option.create({
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            questionId: newQuestion.id,
          },
        });
      }
      
      savedQuestions.push(newQuestion);
    } catch (error) {
      console.error('Error saving question:', error);
      // Continue with next question
    }
  }
  
  return savedQuestions;
}
