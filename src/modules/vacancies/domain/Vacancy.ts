import { DomainError } from '../../../shared/DomainError';

export type NewVacancy = {
  title: string;
  company: string;
  salary: number;
};

export type Vacancy = NewVacancy & {
  id: number;
};

const isBlank = (value: unknown): boolean => typeof value !== 'string' || value.trim() === '';

export const parseNewVacancy = (input: unknown): NewVacancy => {
  const data = (input ?? {}) as Record<string, unknown>;

  if (isBlank(data.title) || isBlank(data.company)) {
    throw new DomainError('El título y la empresa son obligatorios');
  }

  const salary = Number(data.salary);
  if (data.salary === undefined || data.salary === null || Number.isNaN(salary) || salary <= 0) {
    throw new DomainError('El salario debe ser un número mayor que 0');
  }

  return {
    title: (data.title as string).trim(),
    company: (data.company as string).trim(),
    salary,
  };
};
