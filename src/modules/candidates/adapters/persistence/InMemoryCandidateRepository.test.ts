import { describe, expect, it } from 'vitest';
import { createInMemoryCandidateRepository } from './InMemoryCandidateRepository';

const newCandidate = { name: 'María López', email: 'maria.lopez@correo.com', city: 'Quito', experienceYears: 3 };
const otherCandidate = { name: 'Carlos Pérez', email: 'carlos.perez@correo.com', city: 'Cuenca', experienceYears: 5 };

describe('InMemoryCandidateRepository', () => {
  it('saves a candidate and assigns an id', () => {
    const repository = createInMemoryCandidateRepository();
    expect(repository.save(newCandidate)).toEqual({ id: 1, ...newCandidate });
    expect(repository.save(otherCandidate)).toEqual({ id: 2, ...otherCandidate });
  });

  it('lists candidates returning a copy of the internal array', () => {
    const repository = createInMemoryCandidateRepository();
    repository.save(newCandidate);
    repository.save(otherCandidate);
    const list = repository.findAll();
    list.pop();
    list[0].name = 'Modificado';
    expect(repository.findAll()).toEqual([
      { id: 1, ...newCandidate },
      { id: 2, ...otherCandidate },
    ]);
  });

  it('finds a candidate by id or returns undefined', () => {
    const repository = createInMemoryCandidateRepository();
    repository.save(newCandidate);
    expect(repository.findById(1)).toEqual({ id: 1, ...newCandidate });
    expect(repository.findById(99)).toBeUndefined();
  });

  it('removes a candidate by id', () => {
    const repository = createInMemoryCandidateRepository();
    repository.save(newCandidate);
    expect(repository.remove(1)).toBe(true);
    expect(repository.remove(1)).toBe(false);
    expect(repository.findAll()).toEqual([]);
  });
});
