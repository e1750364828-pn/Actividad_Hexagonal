import { Router } from 'express';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { VacancyService } from '../../application/VacancyService';

export const createVacancyRoutes = (service: VacancyService): Router => {
  const router = Router();

  router.get('/', (_req, res) => {
    res.status(HTTP_STATUS.OK).json(service.list());
  });

  router.post('/', (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(service.create(req.body));
  });

  return router;
};
