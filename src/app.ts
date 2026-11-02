import express, { Express } from 'express';
import { createInMemoryVacancyRepository } from './modules/vacancies/adapters/persistence/InMemoryVacancyRepository';
import { createVacancyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRoutes } from './modules/vacancies/adapters/http/vacancyRoutes';
import { createInMemoryCandidateRepository } from './modules/candidates/adapters/persistence/InMemoryCandidateRepository';
import { createPostgresCandidateRepository } from './modules/candidates/adapters/persistence/PostgresCandidateRepository';
import { createCandidateService } from './modules/candidates/application/CandidateService';
import { createCandidateRoutes } from './modules/candidates/adapters/http/candidateRoutes';
import { CandidateRepository } from './modules/candidates/ports/CandidateRepository';
import { createPostgresPool } from './shared/database/postgres';
import { errorHandler } from './shared/errorHandler';

const createSeededInMemoryCandidateRepository = (): CandidateRepository =>
  createInMemoryCandidateRepository([
    {
      id: 1,
      name: 'María López',
      email: 'maria.lopez@correo.com',
      city: 'Quito',
      experienceYears: 3,
      skills: ['TypeScript', 'Node.js'],
    },
    {
      id: 2,
      name: 'Carlos Pérez',
      email: 'carlos.perez@correo.com',
      city: 'Guayaquil',
      experienceYears: 5,
      skills: ['SQL'],
    },
  ]);

export const createCandidateRepository = (env: NodeJS.ProcessEnv = process.env): CandidateRepository => {
  const { CANDIDATES_ADAPTER, DATABASE_URL } = env;

  if (CANDIDATES_ADAPTER === 'sql' && DATABASE_URL) {
    console.log('Candidates persistence: PostgreSQL with pg');
    return createPostgresCandidateRepository(createPostgresPool(DATABASE_URL));
  }

  if (CANDIDATES_ADAPTER === 'sql') {
    console.warn('DATABASE_URL no está definida: se usará el repositorio en memoria');
  }
  console.log('Candidates persistence: in memory');
  return createSeededInMemoryCandidateRepository();
};

export const createApp = (
  candidateRepository: CandidateRepository = createSeededInMemoryCandidateRepository(),
): Express => {
  const app = express();
  app.use(express.json());

  const vacancyRepository = createInMemoryVacancyRepository([
    { id: 1, title: 'Desarrollador Backend', company: 'TechQuito', salary: 1200 },
    { id: 2, title: 'Diseñadora UX', company: 'Andes Digital', salary: 1000 },
  ]);
  const vacancyService = createVacancyService(vacancyRepository);
  app.use('/vacancies', createVacancyRoutes(vacancyService));

  const candidateService = createCandidateService(candidateRepository);
  app.use('/candidates', createCandidateRoutes(candidateService));

  app.use(errorHandler);
  return app;
};
