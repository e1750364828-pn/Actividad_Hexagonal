import { Router } from 'express';
import { DomainError } from '../../../../shared/DomainError';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { CandidateService } from '../../application/CandidateService';

const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id)) throw new DomainError('El identificador no es válido');
  return id;
};

export const createCandidateRoutes = (service: CandidateService): Router => {
  const router = Router();

  router.get('/', (_req, res) => {
    res.status(HTTP_STATUS.OK).json(service.list());
  });

  router.get('/:id', (req, res) => {
    res.status(HTTP_STATUS.OK).json(service.getById(parseId(req.params.id)));
  });

  router.post('/', (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(service.create(req.body));
  });

  router.put('/:id', (req, res) => {
    res.status(HTTP_STATUS.OK).json(service.update(parseId(req.params.id), req.body));
  });

  router.delete('/:id', (req, res) => {
    service.remove(parseId(req.params.id));
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  return router;
};
