import { DomainError } from '../../../shared/DomainError';

export type NewCandidate = {
  name: string;
  email: string;
  city: string;
  experienceYears: number;
  skills: string[];
};

export type Candidate = NewCandidate & {
  id: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value: unknown): boolean => typeof value !== 'string' || value.trim() === '';

const parseSkills = (value: unknown): string[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(isBlank)) {
    throw new DomainError('Las habilidades deben ser una lista de textos');
  }
  return value.map((skill: string) => skill.trim());
};

export const parseNewCandidate = (input: unknown): NewCandidate => {
  const data = (input ?? {}) as Record<string, unknown>;

  if (isBlank(data.name) || isBlank(data.email)) {
    throw new DomainError('El nombre y el correo son obligatorios');
  }

  const email = (data.email as string).trim();
  if (!EMAIL_PATTERN.test(email)) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  if (isBlank(data.city)) {
    throw new DomainError('La ciudad es obligatoria');
  }

  const experienceYears = data.experienceYears;
  if (typeof experienceYears !== 'number' || !Number.isFinite(experienceYears) || experienceYears < 0) {
    throw new DomainError('Los años de experiencia deben ser un número igual o mayor que 0');
  }

  const skills = parseSkills(data.skills);

  return {
    name: (data.name as string).trim(),
    email,
    city: (data.city as string).trim(),
    experienceYears,
    skills,
  };
};
