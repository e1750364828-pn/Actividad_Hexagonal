import { describe, expect, it } from 'vitest';
import { parseNewVacancy } from './Vacancy';

describe('parseNewVacancy', () => {
  it('returns a valid vacancy', () => {
    expect(parseNewVacancy({ title: 'Desarrollador Backend', company: 'TechQuito', salary: 1200 })).toEqual({
      title: 'Desarrollador Backend',
      company: 'TechQuito',
      salary: 1200,
    });
  });

  it('trims text fields', () => {
    expect(parseNewVacancy({ title: '  Analista QA ', company: ' Andes Digital ', salary: 900 })).toEqual({
      title: 'Analista QA',
      company: 'Andes Digital',
      salary: 900,
    });
  });

  it('fails when title is missing', () => {
    expect(() => parseNewVacancy({ company: 'TechQuito', salary: 1200 })).toThrow(
      'El título y la empresa son obligatorios',
    );
  });

  it('fails when company is missing', () => {
    expect(() => parseNewVacancy({ title: 'Desarrollador Backend', salary: 1200 })).toThrow(
      'El título y la empresa son obligatorios',
    );
  });

  it('fails when salary is not greater than 0', () => {
    expect(() => parseNewVacancy({ title: 'Desarrollador Backend', company: 'TechQuito', salary: 0 })).toThrow(
      'El salario debe ser un número mayor que 0',
    );
  });
});
