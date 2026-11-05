# CareerTracka

CareerTracka helps professionals capture their work experience and turn it into clear, evidence-based career achievements.

Users record their weekly tasks, responsibilities and contributions in their own words. CareerTracka uses AI to analyse these entries, identify demonstrated skills and impact, and generate professional, CV-ready achievement statements.

The goal is simple: help people build a reliable record of what they have accomplished without having to remember or reconstruct their work history when updating their CV or pursuing career opportunities.

## Core Features

- **Authentication:** User registration, login, JWT authentication and permission-based access control.
- **Work Entries:** Create, view, filter and manage weekly work records.
- **Impact Context:** Optional guided prompts to capture outcomes, scale, improvements and measurable impact.
- **AI Analysis:** Analyse work entries and generate structured, evidence-based achievement statements.
- **Achievement Portfolio:** Review, edit, approve and archive generated achievements.
- **Generation History:** Retain previous AI-generated versions for comparison and regeneration.
- **API Documentation:** Interactive Swagger documentation.

## How It Works

1. User creates a work entry using free-form text.
2. User optionally provides additional information about the impact of their work.
3. User submits the entry for AI analysis.
4. The AI analyses the entry using the Project, Action, Result (PAR) framework.
5. CareerTracka generates CV-ready achievement statements and identifies demonstrated skills and impact.
6. User reviews, edits, approves or regenerates the output.
7. Approved achievements are retained in the user's portfolio.

**Core principle:** AI improves how work is communicated; it must never invent achievements, metrics or responsibilities.

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- JWT
- Zod
- Swagger
- OpenAI / Ollama

## Architecture

The application follows a layered architecture:

- **Routes:** API endpoint definitions.
- **Middleware:** Authentication, authorization, validation and security.
- **Controllers:** HTTP request and response handling.
- **Services:** Business logic and application workflows.
- **Repositories:** Database operations.
- **Infrastructure:** External integrations, including AI providers and background processing.

## Repository Structure

```text
.
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── infrastructure/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env.example
├── vitest.config.ts
└── README.md
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL
- Redis
- OpenAI API key or a locally running Ollama instance

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Configure your environment:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careertracka


JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourredispassword
```

Use the variable names defined in `.env.example` as the source of truth.

### 3. Start Redis

```bash
docker-compose up -d
```

Ensure PostgreSQL is also running and accessible.

### 4. Initialize the database

```bash
npx prisma generate
npx prisma migrate dev
```

To seed initial data:

```bash
npm run seed
```

### 5. Start the application

```bash
npm run dev
```

API base URL:

```text
http://localhost:3000
```

## API Endpoints

All application endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint |
|---|---|
| POST | `/auth/register` |
| POST | `/auth/login` |
| POST | `/auth/refresh` |
| POST | `/auth/logout` |

### Work Entries

| Method | Endpoint |
|---|---|
| POST | `/work/entries` |
| GET | `/work/entries` |
| GET | `/work/entries/:id` |
| DELETE | `/work/entries/:id` |

### AI Analysis

| Method | Endpoint |
|---|---|
| GET | `/work/entries/:id/analyses` |
| POST | `/work/entries/:id/analyse` |

### Achievements

| Method | Endpoint |
|---|---|
| GET | `/achievements` |
| GET | `/achievements/:id` |
| PATCH | `/achievements/:id` |
| DELETE | `/achievements/:id` |

### API Documentation

- Swagger UI: `/api-docs`
- OpenAPI JSON: `/api-docs.json`

## AI Analysis Principles

CareerTracka uses AI to improve the presentation of professional experience.

The analysis follows these principles:

- Use Project, Action, Result (PAR) as a reasoning framework.
- Prioritise accomplishments over routine responsibilities.
- Use strong action verbs and preserve technical terminology.
- Highlight measurable impact where evidence exists.
- Generate qualitative achievements when metrics are unavailable.
- Never fabricate numbers, outcomes or responsibilities.
- Preserve the user's original meaning.

AI-generated content remains editable and subject to user approval.

## Security

- JWT-based authentication.
- Permission-based authorization.
- User ownership checks on resources.
- Zod request validation.
- Request sanitization.
- Helmet security headers.
- CORS configuration.
- Rate limiting.
- Secure environment-based configuration.

## Development Commands

```bash
npm run dev
npm run build
npm test
npx prisma migrate dev
npx prisma studio
```

## API Design & Product Direction

CareerTracka is designed around three principles:

1. **Capture:** Make it easy to record work as it happens.
2. **Analyse:** Use AI to identify skills, contributions and evidence of impact.
3. **Communicate:** Turn accumulated work experience into clear, credible professional achievements.

The long-term goal is to help professionals build a continuously updated record of their career accomplishments.