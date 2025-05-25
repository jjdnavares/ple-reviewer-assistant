import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from 'database';

/**
 * Get all exams with filtering options
 */
export const getExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subjectId, title, published, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter conditions
    const where: any = {};
    
    if (subjectId) {
      where.subjectId = subjectId as string;
    }
    
    if (title) {
      where.title = {
        contains: title as string,
        mode: 'insensitive'
      };
    }
    
    if (published !== undefined) {
      where.isPublished = published === 'true';
    }
    
    // Get total count for pagination
    const total = await prisma.exam.count({ where });
    
    // Get exams with pagination
    const exams = await prisma.exam.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });
    
    res.status(200).json({
      status: 'success',
      results: exams.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      },
      data: {
        exams
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exam by ID
 */
export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { includeQuestions } = req.query;
    
    // Find the exam
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        ...(includeQuestions === 'true' ? {
          examQuestions: {
            include: {
              question: {
                include: {
                  options: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        } : {})
      }
    });
    
    if (!exam) {
      return next(new AppError('Exam not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        exam
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new exam
 */
export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      subjectId,
      timeLimit,
      passingScore,
      isPublished,
      randomizeQuestions,
      questions
    } = req.body;
    
    if (!title) {
      return next(new AppError('Title is required', 400));
    }
    
    // Create exam in database
    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        subjectId,
        timeLimit: timeLimit || 3600, // Default 1 hour
        passingScore: passingScore || 70, // Default 70%
        isPublished: isPublished || false,
        randomizeQuestions: randomizeQuestions || true,
        questionCount: questions?.length || 0
      }
    });
    
    // Add questions if provided
    if (questions && Array.isArray(questions)) {
      const examQuestions = await Promise.all(
        questions.map(async (questionId: string, index: number) => {
          return prisma.examQuestion.create({
            data: {
              examId: exam.id,
              questionId,
              order: index + 1
            }
          });
        })
      );
      
      // Update question count
      await prisma.exam.update({
        where: { id: exam.id },
        data: {
          questionCount: examQuestions.length
        }
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        exam
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an exam
 */
export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      subjectId,
      timeLimit,
      passingScore,
      isPublished,
      randomizeQuestions,
      questions
    } = req.body;
    
    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examAttempts: {
          where: {
            status: 'COMPLETED'
          }
        }
      }
    });
    
    if (!existingExam) {
      return next(new AppError('Exam not found', 404));
    }
    
    // Prevent modification if the exam has been completed by users
    if (existingExam.examAttempts.length > 0 && questions) {
      return next(new AppError('Cannot modify questions for an exam that has been completed by users', 400));
    }
    
    // Update exam in database
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(subjectId && { subjectId }),
        ...(timeLimit && { timeLimit }),
        ...(passingScore && { passingScore }),
        ...(isPublished !== undefined && { isPublished }),
        ...(randomizeQuestions !== undefined && { randomizeQuestions })
      }
    });
    
    // Update questions if provided
    if (questions && Array.isArray(questions)) {
      // Delete existing questions
      await prisma.examQuestion.deleteMany({
        where: { examId: id }
      });
      
      // Add new questions
      const examQuestions = await Promise.all(
        questions.map(async (questionId: string, index: number) => {
          return prisma.examQuestion.create({
            data: {
              examId: exam.id,
              questionId,
              order: index + 1
            }
          });
        })
      );
      
      // Update question count
      await prisma.exam.update({
        where: { id: exam.id },
        data: {
          questionCount: examQuestions.length
        }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        exam
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an exam
 */
export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examAttempts: true
      }
    });
    
    if (!existingExam) {
      return next(new AppError('Exam not found', 404));
    }
    
    // Prevent deletion if the exam has been attempted by users
    if (existingExam.examAttempts.length > 0) {
      return next(new AppError('Cannot delete an exam that has been attempted by users', 400));
    }
    
    // Delete exam questions first (cascade will handle this, but being explicit)
    await prisma.examQuestion.deleteMany({
      where: { examId: id }
    });
    
    // Delete exam
    await prisma.exam.delete({
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
 * Start an exam attempt
 */
export const startExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return next(new AppError('User ID is required', 400));
    }
    
    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: {
          include: {
            question: {
              include: {
                options: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!exam) {
      return next(new AppError('Exam not found', 404));
    }
    
    if (!exam.isPublished) {
      return next(new AppError('This exam is not published yet', 400));
    }
    
    // Check for any in-progress attempts
    const inProgressAttempt = await prisma.examAttempt.findFirst({
      where: {
        userId,
        examId: id,
        status: 'IN_PROGRESS'
      }
    });
    
    if (inProgressAttempt) {
      return res.status(200).json({
        status: 'success',
        data: {
          attemptId: inProgressAttempt.id,
          message: 'You have an in-progress attempt for this exam'
        }
      });
    }
    
    // Create new attempt
    const attempt = await prisma.examAttempt.create({
      data: {
        userId,
        examId: id,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });
    
    // Get questions
    let questions = exam.examQuestions;
    
    // Randomize questions if needed
    if (exam.randomizeQuestions) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }
    
    // Create attempt questions
    const attemptQuestions = await Promise.all(
      questions.map(async (examQuestion, index) => {
        // Create attempt question
        const attemptQuestion = await prisma.examAttemptQuestion.create({
          data: {
            attemptId: attempt.id,
            questionId: examQuestion.question.id,
            order: index + 1,
            isFlagged: false
          }
        });
        
        // Create attempt answers
        await Promise.all(
          examQuestion.question.options.map(async (option) => {
            return prisma.examAttemptAnswer.create({
              data: {
                attemptQuestionId: attemptQuestion.id,
                optionId: option.id,
                isSelected: false
              }
            });
          })
        );
        
        return attemptQuestion;
      })
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        attemptId: attempt.id,
        timeLimit: exam.timeLimit,
        questionCount: attemptQuestions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit an exam attempt
 */
export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { attemptId, answers, timeSpent } = req.body;
    const userId = req.user?.id;
    
    if (!userId || !attemptId) {
      return next(new AppError('User ID and Attempt ID are required', 400));
    }
    
    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id }
    });
    
    if (!exam) {
      return next(new AppError('Exam not found', 404));
    }
    
    // Check if attempt exists and belongs to user
    const attempt = await prisma.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
        examId: id,
        status: 'IN_PROGRESS'
      }
    });
    
    if (!attempt) {
      return next(new AppError('Exam attempt not found or already completed', 404));
    }
    
    // Process answers if provided
    if (answers && typeof answers === 'object') {
      for (const [questionId, selectedOptionIds] of Object.entries(answers)) {
        // Find the attempt question
        const attemptQuestion = await prisma.examAttemptQuestion.findFirst({
          where: {
            attemptId,
            questionId
          },
          include: {
            answers: true
          }
        });
        
        if (attemptQuestion) {
          // Update answers
          for (const answer of attemptQuestion.answers) {
            await prisma.examAttemptAnswer.update({
              where: { id: answer.id },
              data: {
                isSelected: Array.isArray(selectedOptionIds) 
                  ? selectedOptionIds.includes(answer.optionId)
                  : answer.optionId === selectedOptionIds
              }
            });
          }
        }
      }
    }
    
    // Calculate score
    const attemptQuestions = await prisma.examAttemptQuestion.findMany({
      where: { attemptId },
      include: {
        question: {
          include: {
            options: {
              where: {
                isCorrect: true
              }
            }
          }
        },
        answers: {
          where: {
            isSelected: true
          }
        }
      }
    });
    
    let correctCount = 0;
    
    for (const attemptQuestion of attemptQuestions) {
      const correctOptionIds = attemptQuestion.question.options.map(o => o.id);
      const selectedOptionIds = attemptQuestion.answers.map(a => a.optionId);
      
      // Simple scoring: correct if exactly the right options are selected
      const isCorrect = 
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every(id => selectedOptionIds.includes(id));
      
      if (isCorrect) {
        correctCount++;
      }
    }
    
    // Calculate percentage score
    const totalQuestions = attemptQuestions.length;
    const score = totalQuestions > 0 
      ? Math.round((correctCount / totalQuestions) * 100) 
      : 0;
    
    // Update attempt
    const completedAttempt = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        score,
        completedAt: new Date(),
        timeSpent: timeSpent || null
      }
    });
    
    // Determine if passed
    const passed = score >= exam.passingScore;
    
    res.status(200).json({
      status: 'success',
      data: {
        attempt: completedAttempt,
        score,
        totalQuestions,
        correctCount,
        passed
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all attempts for an exam
 */
export const getExamAttempts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter conditions
    const where: any = {
      examId: id
    };
    
    if (status) {
      where.status = status;
    }
    
    // Get total count for pagination
    const total = await prisma.examAttempt.count({ where });
    
    // Get attempts with pagination
    const attempts = await prisma.examAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });
    
    res.status(200).json({
      status: 'success',
      results: attempts.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      },
      data: {
        attempts
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exam attempt by ID
 */
export const getExamAttemptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user?.id;
    
    // Check if attempt exists
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!attempt) {
      return next(new AppError('Attempt not found', 404));
    }
    
    // Restrict access to owner or admin
    if (attempt.userId !== userId && req.user?.role !== 'ADMIN') {
      return next(new AppError('Not authorized to view this attempt', 403));
    }
    
    // Get attempt questions and answers
    const attemptQuestions = await prisma.examAttemptQuestion.findMany({
      where: { attemptId },
      include: {
        question: {
          include: {
            options: true
          }
        },
        answers: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        attempt,
        questions: attemptQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};
