import { describe, expect, it } from 'vitest';
import { createInMemoryCandidateRepository } from './InMemoryCandidateRepository';

const newCandidate = {
  name: 'María López',
  email: 'maria.lopez@correo.com',
  city: 'Quito',
  experienceYears: 3,
  skills: ['TypeScript', 'SQL'],
};
const otherCandidate = {
  name: 'Carlos Pérez',
  email: 'carlos.perez@correo.com',
  city: 'Cuenca',
  experienceYears: 5,
  skills: [],
};

describe('InMemoryCandidateRepository', () => {
  it('saves a candidate and assigns an id', async () => {
    const repository = createInMemoryCandidateRepository();
    expect(await repository.save(newCandidate)).toEqual({ id: 1, ...newCandidate });
    expect(await repository.save(otherCandidate)).toEqual({ id: 2, ...otherCandidate });
  });

  it('lists candidates returning a copy of the internal array', async () => {
    const repository = createInMemoryCandidateRepository();
    await repository.save(newCandidate);
    await repository.save(otherCandidate);
    const list = await repository.findAll();
    list.pop();
    list[0].name = 'Modificado';
    list[0].skills.push('Modificado');
    expect(await repository.findAll()).toEqual([
      { id: 1, ...newCandidate },
      { id: 2, ...otherCandidate },
    ]);
  });

  it('finds a candidate by id or returns undefined', async () => {
    const repository = createInMemoryCandidateRepository();
    await repository.save(newCandidate);
    expect(await repository.findById(1)).toEqual({ id: 1, ...newCandidate });
    expect(await repository.findById(99)).toBeUndefined();
  });

  it('updates a candidate or returns undefined when it does not exist', async () => {
    const repository = createInMemoryCandidateRepository();
    await repository.save(newCandidate);
    expect(await repository.update(1, otherCandidate)).toEqual({ id: 1, ...otherCandidate });
    expect(await repository.update(99, otherCandidate)).toBeUndefined();
  });

  it('removes a candidate by id', async () => {
    const repository = createInMemoryCandidateRepository();
    await repository.save(newCandidate);
    expect(await repository.remove(1)).toBe(true);
    expect(await repository.remove(1)).toBe(false);
    expect(await repository.findAll()).toEqual([]);
  });
});
