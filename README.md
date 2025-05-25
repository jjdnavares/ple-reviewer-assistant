# PLE Reviewer Assistant

A comprehensive medical licensure exam review application with AI-powered assistance.

## Tech Stack

### Frontend
- Next.js with TypeScript
- Shadcn/ui components
- Tailwind CSS for styling
- Zustand for state management

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL database

### AI Integration
- LangChain for orchestration
- Vector database (Pinecone)
- OpenAI API / Claude API

### Authentication
- NextAuth.js (Auth.js)

### Real-time Features
- Socket.io

### File Storage
- MinIO (S3-compatible)

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- pnpm (or yarn/npm)
- PostgreSQL
- Docker (optional, for containerization)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ple-reviewer-assistant.git
cd ple-reviewer-assistant
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
pnpm dev
```

## Project Structure

```
ple-reviewer-assistant/
├── apps/                      # Application packages
│   ├── frontend/              # Next.js frontend application
│   ├── backend/               # Express API server
│   └── admin/                 # Admin dashboard (Next.js)
├── packages/                  # Shared packages
│   ├── database/              # Database schema and Prisma setup
│   ├── ai/                    # AI integration logic
│   ├── pdf-processor/         # PDF processing utilities
│   ├── exam-engine/           # Exam engine logic
│   ├── ui/                    # Shared UI components
│   └── config/                # Shared configuration
├── docker/                    # Docker configuration
├── scripts/                   # Utility scripts
└── docs/                      # Documentation
```

## Features

- PDF questionnaire upload and parsing
- AI-powered chat for answering medical questions
- Microsoft certification exam-like experience
- Performance analytics and progress tracking
- Spaced repetition for improved learning
- Mobile-friendly design with planned native apps

## License

[MIT](LICENSE)
