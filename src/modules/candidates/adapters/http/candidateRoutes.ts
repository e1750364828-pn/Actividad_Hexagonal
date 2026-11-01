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

  router.get('/', async (_req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list());
  });

  router.get('/:id', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.getById(parseId(req.params.id)));
  });

  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  router.put('/:id', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.update(parseId(req.params.id), req.body));
  });

  router.delete('/:id', async (req, res) => {
    await service.remove(parseId(req.params.id));
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  return router;
};
