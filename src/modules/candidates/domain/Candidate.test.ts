import { describe, expect, it } from 'vitest';
import { parseNewCandidate } from './Candidate';

const validCandidate = {
  name: 'María López',
  email: 'maria.lopez@correo.com',
  city: 'Quito',
  experienceYears: 3,
  skills: ['TypeScript', 'SQL'],
};

describe('parseNewCandidate', () => {
  it('returns a valid candidate', () => {
    expect(parseNewCandidate({ ...validCandidate, name: '  María López ' })).toEqual(validCandidate);
  });

  it('defaults skills to an empty list when not provided', () => {
    expect(parseNewCandidate({ ...validCandidate, skills: undefined }).skills).toEqual([]);
  });

  it('accepts a valid list of skills and trims each one', () => {
    expect(parseNewCandidate({ ...validCandidate, skills: [' TypeScript ', 'SQL'] }).skills).toEqual([
      'TypeScript',
      'SQL',
    ]);
    expect(parseNewCandidate({ ...validCandidate, skills: [] }).skills).toEqual([]);
  });

  it('fails when skills is not a list of non-empty texts', () => {
    const message = 'Las habilidades deben ser una lista de textos';
    expect(() => parseNewCandidate({ ...validCandidate, skills: 'TypeScript' })).toThrow(message);
    expect(() => parseNewCandidate({ ...validCandidate, skills: ['TypeScript', 3] })).toThrow(message);
    expect(() => parseNewCandidate({ ...validCandidate, skills: ['TypeScript', '  '] })).toThrow(message);
    expect(() => parseNewCandidate({ ...validCandidate, skills: null })).toThrow(message);
  });

  it('fails when name or email is missing', () => {
    expect(() => parseNewCandidate({ ...validCandidate, name: '' })).toThrow('El nombre y el correo son obligatorios');
    expect(() => parseNewCandidate({ ...validCandidate, email: undefined })).toThrow(
      'El nombre y el correo son obligatorios',
    );
  });

  it('fails when email has an invalid format', () => {
    expect(() => parseNewCandidate({ ...validCandidate, email: 'maria.correo.com' })).toThrow(
      'El correo no tiene un formato válido',
    );
  });

  it('fails when city is missing', () => {
    expect(() => parseNewCandidate({ ...validCandidate, city: '   ' })).toThrow('La ciudad es obligatoria');
  });

  it('fails when experienceYears is not a number greater than or equal to 0', () => {
    const message = 'Los años de experiencia deben ser un número igual o mayor que 0';
    expect(() => parseNewCandidate({ ...validCandidate, experienceYears: -1 })).toThrow(message);
    expect(() => parseNewCandidate({ ...validCandidate, experienceYears: 'tres' })).toThrow(message);
  });
});
