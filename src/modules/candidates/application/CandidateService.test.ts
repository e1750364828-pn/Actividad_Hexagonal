import { describe, expect, it } from 'vitest';
import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { createInMemoryCandidateRepository } from '../adapters/persistence/InMemoryCandidateRepository';
import { createCandidateService } from './CandidateService';

const maria = { id: 1, name: 'María López', email: 'maria.lopez@correo.com', city: 'Quito', experienceYears: 3 };
const newCandidate = { name: 'Carlos Pérez', email: 'carlos.perez@correo.com', city: 'Cuenca', experienceYears: 5 };

const buildService = () => createCandidateService(createInMemoryCandidateRepository([maria]));

describe('CandidateService', () => {
  it('lists candidates', () => {
    expect(buildService().list()).toEqual([maria]);
  });

  it('gets a candidate by id and throws NotFoundError when it does not exist', () => {
    const service = buildService();
    expect(service.getById(1)).toEqual(maria);
    expect(() => service.getById(99)).toThrow(NotFoundError);
    expect(() => service.getById(99)).toThrow('Candidato no encontrado');
  });

  it('creates a valid candidate and rejects invalid data', () => {
    const service = buildService();
    expect(service.create(newCandidate)).toEqual({ id: 2, ...newCandidate });
    expect(() => service.create({ ...newCandidate, city: '' })).toThrow(DomainError);
  });

  it('updates a candidate and throws NotFoundError when it does not exist', () => {
    const service = buildService();
    expect(service.update(1, newCandidate)).toEqual({ id: 1, ...newCandidate });
    expect(service.getById(1)).toEqual({ id: 1, ...newCandidate });
    expect(() => service.update(99, newCandidate)).toThrow(NotFoundError);
    expect(() => service.update(1, { ...newCandidate, email: 'invalido' })).toThrow(
      'El correo no tiene un formato válido',
    );
  });

  it('removes a candidate and throws NotFoundError when it does not exist', () => {
    const service = buildService();
    service.remove(1);
    expect(service.list()).toEqual([]);
    expect(() => service.remove(1)).toThrow(NotFoundError);
  });
});
