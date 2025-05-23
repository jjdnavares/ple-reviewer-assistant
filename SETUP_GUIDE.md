# MedReview Monorepo Setup Guide

This guide walks you through setting up the MedReview monorepo for both frontend (Next.js) and backend (NestJS).

---

## 1. Prerequisites
- **Node.js** v18+
- **pnpm** (preferred) or npm
- **PostgreSQL** (local or cloud)
- (Optional) **NestJS CLI**: `npm i -g @nestjs/cli`

---

## 2. Directory Structure
```
ple-reviewer-assistant/
├─ apps/
│  ├─ frontend/
│  └─ backend/
├─ packages/
├─ prisma/           # (optional: for Prisma ORM)
├─ env.example
├─ pnpm-workspace.yaml
├─ README.md
└─ SETUP_GUIDE.md
```

---

## 3. Initialize Frontend (Next.js)

```
cd apps/frontend
pnpm create next-app . --ts --app --tailwind --eslint
```

- Accept prompts as needed (or use defaults).
- This sets up TypeScript, Tailwind CSS, and ESLint.

### Install shadcn/ui
```
npx shadcn-ui@latest init
```

### Install Zustand and Framer Motion
```
pnpm add zustand framer-motion
```

---

## 4. Initialize Backend (NestJS)

```
cd ../../backend
pnpm create nestjs-app .
# OR (if using global CLI)
nest new .
```

- Choose "npm" or "pnpm" as package manager.
- Accept defaults for now.

### Install PostgreSQL, JWT, and Prisma (optional)
```
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt pg
pnpm add -D prisma @prisma/client
```

---

## 5. Environment Variables

- Copy `env.example` to `.env` in the root and fill in your secrets.
- Reference `.env` from both frontend and backend as needed.

---

## 6. Database (Optional: Prisma ORM)

- Edit `prisma/schema.prisma` for your DB schema.
- Run migrations:
```
cd prisma
pnpm prisma migrate dev
```

---

## 7. Running the Apps

### Frontend
```
cd apps/frontend
pnpm dev
```

### Backend
```
cd apps/backend
pnpm start:dev
```

---

## 8. Useful Scripts
- Add shared types or utilities to `packages/`.
- Use `pnpm install` at the root to install all dependencies.

---

## 9. Resources
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Framer Motion](https://www.framer.com/motion/)

---

For help, see `README.md` or contact the MedReview team.
