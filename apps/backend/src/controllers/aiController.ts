import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from 'database';
import { OpenAI } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';

// Initialize OpenAI client
const openai = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4-turbo',
  temperature: 0.1,
});

/**
 * Ask a question to the AI assistant using RAG
 */
export const askQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, context, subjectId } = req.body;

    if (!question) {
      return next(new AppError('Question is required', 400));
    }

    // Retrieve relevant content from the vector database based on the question
    // This is a simplified version - in production, you would use a proper vector database like Pinecone
    const relatedDocuments = await retrieveRelevantContent(question, subjectId);
    
    // Generate response using OpenAI with the retrieved context
    const response = await generateAIResponse(question, relatedDocuments, context);
    
    // Return the response
    res.status(200).json({
      status: 'success',
      data: {
        answer: response.answer,
        sources: response.sources,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate an explanation for a specific question or concept
 */
export const generateExplanation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId, conceptName, detail } = req.body;
    
    if (!questionId && !conceptName) {
      return next(new AppError('Either questionId or conceptName is required', 400));
    }
    
    let content = "";
    let question = null;
    
    // If questionId is provided, get the question details
    if (questionId) {
      question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { 
          options: true,
          topic: true,
          subject: true
        }
      });
      
      if (!question) {
        return next(new AppError('Question not found', 404));
      }
      
      content = `Question: ${question.text}\n`;
      if (question.options) {
        content += "Options:\n";
        for (const option of question.options) {
          content += `- ${option.text}${option.isCorrect ? ' (correct)' : ''}\n`;
        }
      }
    } else {
      content = `Concept: ${conceptName}\n`;
    }
    
    // Set the detail level for the explanation
    const detailLevel = detail || 'medium';
    
    // Generate the explanation
    const explanation = await generateExplanationWithSources(content, detailLevel, question?.subjectId);
    
    res.status(200).json({
      status: 'success',
      data: {
        explanation: explanation.content,
        sources: explanation.sources,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content related to a topic or question
 */
export const getRelatedContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, questionId, limit } = req.query;
    
    if (!topic && !questionId) {
      return next(new AppError('Either topic or questionId is required', 400));
    }
    
    const maxResults = limit ? parseInt(limit as string) : 5;
    
    let relatedContent: any[] = [];
    
    if (questionId) {
      // Get related content for a specific question
      const question = await prisma.question.findUnique({
        where: { id: questionId as string },
        include: { topic: true }
      });
      
      if (!question) {
        return next(new AppError('Question not found', 404));
      }
      
      // Get similar questions from the same topic
      const similarQuestions = await prisma.question.findMany({
        where: {
          topicId: question.topicId,
          id: { not: questionId as string }
        },
        take: maxResults,
        include: { options: true }
      });
      
      relatedContent = similarQuestions;
    } else {
      // Get content related to a topic
      const topicResults = await prisma.topic.findMany({
        where: {
          name: { contains: topic as string, mode: 'insensitive' }
        },
        include: {
          questions: {
            take: maxResults,
            include: { options: true }
          }
        },
        take: 2
      });
      
      relatedContent = topicResults;
    }
    
    res.status(200).json({
      status: 'success',
      results: relatedContent.length,
      data: {
        relatedContent
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get hints for a question without revealing the answer
 */
export const getQuestionHints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionId, hintLevel } = req.body;
    
    if (!questionId) {
      return next(new AppError('Question ID is required', 400));
    }
    
    const level = hintLevel || 1; // Default hint level
    
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { 
        options: true,
        topic: true,
        subject: true
      }
    });
    
    if (!question) {
      return next(new AppError('Question not found', 404));
    }
    
    // Generate hint based on the hint level
    const hint = await generateHint(question, level);
    
    res.status(200).json({
      status: 'success',
      data: {
        hint,
        hintLevel: level
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function retrieveRelevantContent(query: string, subjectId?: string) {
  // This is a simplified version of content retrieval
  // In production, you would:
  // 1. Convert the query to an embedding
  // 2. Search the vector database for similar content
  // 3. Return the most relevant documents
  
  try {
    // Example implementation with in-memory vector store for demonstration
    // For production, use Pinecone or another vector database
    
    // Get questions that might be relevant
    const questions = await prisma.question.findMany({
      where: {
        ...(subjectId ? { subjectId } : {}),
        OR: [
          { text: { contains: query, mode: 'insensitive' } },
          { explanation: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        options: true,
        topic: true,
        subject: true,
      },
      take: 5,
    });
    
    return questions.map(q => ({
      id: q.id,
      content: `${q.text}\n${q.explanation || ''}`,
      metadata: {
        source: 'question',
        questionId: q.id,
        topic: q.topic?.name,
        subject: q.subject?.name,
      }
    }));
  } catch (error) {
    console.error('Error retrieving relevant content:', error);
    return [];
  }
}

async function generateAIResponse(question: string, documents: any[], context?: string) {
  try {
    // Prepare context from retrieved documents
    let contextText = '';
    if (documents.length > 0) {
      contextText = documents.map(doc => doc.content).join('\n\n');
    }
    
    // Add user-provided context if available
    if (context) {
      contextText += `\n\nAdditional context: ${context}`;
    }
    
    // Prepare the prompt
    const prompt = `
    You are a medical expert assistant helping with a medical licensure exam.
    
    Use the following context to answer the question. If the context doesn't contain
    relevant information, use your medical knowledge but be clear about what information
    comes from the context vs. your general knowledge.
    
    Context:
    ${contextText}
    
    Question: ${question}
    
    Provide a clear, concise, and accurate answer with medical reasoning.
    `;
    
    // Call OpenAI API
    const response = await openai.invoke(prompt);
    
    // Extract sources for citation
    const sources = documents.map(doc => ({
      id: doc.id,
      source: doc.metadata.source,
      title: doc.metadata.topic || doc.metadata.subject || 'Unknown',
    }));
    
    return {
      answer: response,
      sources: sources
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new AppError('Failed to generate AI response', 500);
  }
}

async function generateExplanationWithSources(content: string, detailLevel: string, subjectId?: string) {
  try {
    // Adjust detail level instructions
    let detailInstructions = '';
    
    switch (detailLevel) {
      case 'basic':
        detailInstructions = 'Keep the explanation simple and concise, suitable for beginners.';
        break;
      case 'medium':
        detailInstructions = 'Provide a moderately detailed explanation with some medical reasoning.';
        break;
      case 'advanced':
        detailInstructions = 'Provide a comprehensive explanation with detailed medical reasoning, pathophysiology, and clinical correlations.';
        break;
      default:
        detailInstructions = 'Provide a moderately detailed explanation with some medical reasoning.';
    }
    
    // Prepare the prompt
    const prompt = `
    You are a medical expert assistant helping with a medical licensure exam.
    
    ${content}
    
    ${detailInstructions}
    
    Provide a clear explanation focusing on why the correct answer is correct and why other options are incorrect.
    Include relevant medical principles, mechanisms, and clinical correlations.
    `;
    
    // Call OpenAI API
    const response = await openai.invoke(prompt);
    
    return {
      content: response,
      sources: [] // In production, include actual sources
    };
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new AppError('Failed to generate explanation', 500);
  }
}

async function generateHint(question: any, level: number) {
  try {
    // Determine hint content based on level
    let hintInstruction = '';
    
    switch (level) {
      case 1:
        hintInstruction = 'Provide a very subtle hint about the general topic or category without revealing specific details about the answer.';
        break;
      case 2:
        hintInstruction = 'Provide a moderate hint that narrows down the possible answers but still requires knowledge to determine the correct one.';
        break;
      case 3:
        hintInstruction = 'Provide a strong hint that points more directly to the answer without explicitly stating it.';
        break;
      default:
        hintInstruction = 'Provide a very subtle hint about the general topic or category without revealing specific details about the answer.';
    }
    
    // Prepare content
    const content = `
    Question: ${question.text}
    
    Options:
    ${question.options.map((opt: any) => `- ${opt.text}`).join('\n')}
    
    Topic: ${question.topic?.name || 'Unknown'}
    Subject: ${question.subject?.name || 'Unknown'}
    `;
    
    // Prepare the prompt
    const prompt = `
    You are a medical expert assistant helping with a medical licensure exam.
    
    ${content}
    
    ${hintInstruction}
    
    DO NOT reveal the correct answer directly. The hint should guide the student toward the correct reasoning process.
    `;
    
    // Call OpenAI API
    const hint = await openai.invoke(prompt);
    
    return hint;
  } catch (error) {
    console.error('Error generating hint:', error);
    throw new AppError('Failed to generate hint', 500);
  }
}
