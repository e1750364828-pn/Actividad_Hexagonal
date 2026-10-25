import express, { Express } from 'express';
import { createInMemoryVacancyRepository } from './modules/vacancies/adapters/persistence/InMemoryVacancyRepository';
import { createVacancyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRoutes } from './modules/vacancies/adapters/http/vacancyRoutes';
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

  app.use(errorHandler);
  return app;
};
