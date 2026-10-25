import express, { Express } from 'express';
import { createInMemoryVacancyRepository } from './modules/vacancies/adapters/persistence/InMemoryVacancyRepository';
import { createVacancyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRoutes } from './modules/vacancies/adapters/http/vacancyRoutes';
import { createInMemoryCandidateRepository } from './modules/candidates/adapters/persistence/InMemoryCandidateRepository';
import { createCandidateService } from './modules/candidates/application/CandidateService';
import { createCandidateRoutes } from './modules/candidates/adapters/http/candidateRoutes';
import { errorHandler } from './shared/errorHandler';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  const vacancyRepository = createInMemoryVacancyRepository([
    { id: 1, title: 'Desarrollador Backend', company: 'TechQuito', salary: 1200 },
    { id: 2, title: 'Diseñadora UX', company: 'Andes Digital', salary: 1000 },
  ]);
  const vacancyService = createVacancyService(vacancyRepository);
  app.use('/vacancies', createVacancyRoutes(vacancyService));

  const candidateRepository = createInMemoryCandidateRepository([
    { id: 1, name: 'María López', email: 'maria.lopez@correo.com', city: 'Quito', experienceYears: 3 },
    { id: 2, name: 'Carlos Pérez', email: 'carlos.perez@correo.com', city: 'Guayaquil', experienceYears: 5 },
  ]);
  const candidateService = createCandidateService(candidateRepository);
  app.use('/candidates', createCandidateRoutes(candidateService));

  app.use(errorHandler);
  return app;
};
