# MedReview Monorepo

A digital sanctuary where aspiring physicians transform stress into confidence.

## Structure

- `apps/frontend` — Next.js 14+ (TypeScript, Tailwind CSS, shadcn/ui)
- `apps/backend` — NestJS (TypeScript, PostgreSQL)
- `packages/` — Shared code (e.g., types)
- `.gitignore` — Node, env, build outputs
- `env.example` — Template for required environment variables

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL (local or cloud)

### Setup
1. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
2. Copy `env.example` to `.env` and fill in secrets.
3. See `apps/frontend/README.md` and `apps/backend/README.md` for app-specific instructions.

---

**Frontend:**
- Run: `pnpm --filter frontend dev`

**Backend:**
- Run: `pnpm --filter backend start:dev`

---

**Contact:**
For setup help, reach out to the MedReview team.
