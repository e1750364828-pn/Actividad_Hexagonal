import { NewVacancy, Vacancy } from '../domain/Vacancy';

export type VacancyRepository = {
  findAll: () => Vacancy[];
  save: (vacancy: NewVacancy) => Vacancy;
};
