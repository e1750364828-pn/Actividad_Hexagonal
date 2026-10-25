import { describe, expect, it } from 'vitest';
import { createInMemoryVacancyRepository } from '../adapters/persistence/InMemoryVacancyRepository';
import { createVacancyService } from './VacancyService';

const newVacancy = { title: 'Desarrollador Backend', company: 'TechQuito', salary: 1200 };

describe('VacancyService', () => {
  it('lists vacancies', () => {
    const service = createVacancyService(createInMemoryVacancyRepository([{ id: 1, ...newVacancy }]));
    expect(service.list()).toEqual([{ id: 1, ...newVacancy }]);
  });

  it('creates a valid vacancy', () => {
    const service = createVacancyService(createInMemoryVacancyRepository());
    expect(service.create(newVacancy)).toEqual({ id: 1, ...newVacancy });
  });

  it('rejects an invalid vacancy', () => {
    const service = createVacancyService(createInMemoryVacancyRepository());
    expect(() => service.create({ ...newVacancy, title: '' })).toThrow('El título y la empresa son obligatorios');
  });
});
