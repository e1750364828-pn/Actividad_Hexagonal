import { NewVacancy, Vacancy } from '../../domain/Vacancy';
import { VacancyRepository } from '../../ports/VacancyRepository';

export const createInMemoryVacancyRepository = (initial: Vacancy[] = []): VacancyRepository => {
  const vacancies: Vacancy[] = initial.map((vacancy) => ({ ...vacancy }));
  let nextId = vacancies.reduce((max, vacancy) => Math.max(max, vacancy.id), 0) + 1;

  const findAll = (): Vacancy[] => vacancies.map((vacancy) => ({ ...vacancy }));

  const save = (newVacancy: NewVacancy): Vacancy => {
    const vacancy: Vacancy = { id: nextId++, ...newVacancy };
    vacancies.push(vacancy);
    return { ...vacancy };
  };

  return { findAll, save };
};
