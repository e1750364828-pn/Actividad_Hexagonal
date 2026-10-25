import { parseNewVacancy, Vacancy } from '../domain/Vacancy';
import { VacancyRepository } from '../ports/VacancyRepository';

export type VacancyService = {
  list: () => Vacancy[];
  create: (input: unknown) => Vacancy;
};

export const createVacancyService = (repository: VacancyRepository): VacancyService => {
  const list = (): Vacancy[] => repository.findAll();

  const create = (input: unknown): Vacancy => repository.save(parseNewVacancy(input));

  return { list, create };
};
