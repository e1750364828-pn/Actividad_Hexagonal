import { describe, expect, it } from 'vitest';
import { createInMemoryVacancyRepository } from './InMemoryVacancyRepository';

const newVacancy = { title: 'Desarrollador Backend', company: 'TechQuito', salary: 1200 };

describe('InMemoryVacancyRepository', () => {
  it('saves a vacancy and assigns an id', () => {
    const repository = createInMemoryVacancyRepository();
    expect(repository.save(newVacancy)).toEqual({ id: 1, ...newVacancy });
  });

  it('lists saved vacancies', () => {
    const repository = createInMemoryVacancyRepository();
    repository.save(newVacancy);
    repository.save({ ...newVacancy, title: 'Diseñadora UX' });
    expect(repository.findAll()).toHaveLength(2);
  });

  it('returns copies so the internal array cannot be modified', () => {
    const repository = createInMemoryVacancyRepository();
    repository.save(newVacancy);
    repository.findAll().pop();
    expect(repository.findAll()).toHaveLength(1);
  });
});
