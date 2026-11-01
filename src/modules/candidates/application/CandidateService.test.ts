import { describe, expect, it } from 'vitest';
import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { createInMemoryCandidateRepository } from '../adapters/persistence/InMemoryCandidateRepository';
import { createCandidateService } from './CandidateService';

const maria = {
  id: 1,
  name: 'María López',
  email: 'maria.lopez@correo.com',
  city: 'Quito',
  experienceYears: 3,
  skills: ['TypeScript'],
};
const newCandidate = {
  name: 'Carlos Pérez',
  email: 'carlos.perez@correo.com',
  city: 'Cuenca',
  experienceYears: 5,
  skills: ['SQL', 'Docker'],
};

const buildService = () => createCandidateService(createInMemoryCandidateRepository([maria]));

describe('CandidateService', () => {
  it('lists candidates', async () => {
    expect(await buildService().list()).toEqual([maria]);
  });

  it('gets a candidate by id and throws NotFoundError when it does not exist', async () => {
    const service = buildService();
    expect(await service.getById(1)).toEqual(maria);
    await expect(service.getById(99)).rejects.toThrow(NotFoundError);
    await expect(service.getById(99)).rejects.toThrow('Candidato no encontrado');
  });

  it('creates a valid candidate and rejects invalid data', async () => {
    const service = buildService();
    expect(await service.create(newCandidate)).toEqual({ id: 2, ...newCandidate });
    await expect(service.create({ ...newCandidate, city: '' })).rejects.toThrow(DomainError);
  });

  it('updates a candidate and throws NotFoundError when it does not exist', async () => {
    const service = buildService();
    expect(await service.update(1, newCandidate)).toEqual({ id: 1, ...newCandidate });
    expect(await service.getById(1)).toEqual({ id: 1, ...newCandidate });
    await expect(service.update(99, newCandidate)).rejects.toThrow(NotFoundError);
    await expect(service.update(1, { ...newCandidate, email: 'invalido' })).rejects.toThrow(
      'El correo no tiene un formato válido',
    );
  });

  it('removes a candidate and throws NotFoundError when it does not exist', async () => {
    const service = buildService();
    await service.remove(1);
    expect(await service.list()).toEqual([]);
    await expect(service.remove(1)).rejects.toThrow(NotFoundError);
  });
});
