import 'dotenv/config';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { createPostgresPool } from '../../../../shared/database/postgres';
import { CandidateRepository } from '../../ports/CandidateRepository';
import { createPostgresCandidateRepository } from './PostgresCandidateRepository';

const { DATABASE_URL, TEST_DATABASE_URL } = process.env;

if (!TEST_DATABASE_URL) {
  throw new Error('Defina TEST_DATABASE_URL en el archivo .env para ejecutar las pruebas de integración');
}
if (TEST_DATABASE_URL === DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borran los datos');
}

const ana = {
  name: 'Ana Torres',
  email: 'ana@correo.com',
  city: 'Quito',
  experienceYears: 2,
  skills: ['TypeScript', 'SQL'],
};
const luis = {
  name: 'Luis Andrade',
  email: 'luis.andrade@correo.com',
  city: 'Cuenca',
  experienceYears: 4.5,
  skills: [],
};

describe('PostgresCandidateRepository (integration)', () => {
  let pool: Pool;
  let repository: CandidateRepository;

  beforeAll(() => {
    pool = createPostgresPool(TEST_DATABASE_URL);
    repository = createPostgresCandidateRepository(pool);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE candidates RESTART IDENTITY');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('returns an empty list when the table is empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a candidate and assigns a numeric id', async () => {
    const saved = await repository.save(ana);
    expect(saved).toEqual({ id: expect.any(Number), ...ana });
    expect((await repository.save(luis)).id).toBe(saved.id + 1);
  });

  it('stores and retrieves skills without changes', async () => {
    const { id } = await repository.save({ ...ana, skills: ['Node.js', 'C#', 'Bases de datos'] });
    expect((await repository.findById(id))?.skills).toEqual(['Node.js', 'C#', 'Bases de datos']);
    const { id: emptyId } = await repository.save(luis);
    expect((await repository.findById(emptyId))?.skills).toEqual([]);
  });

  it('lists all candidates ordered by id', async () => {
    const first = await repository.save(ana);
    const second = await repository.save(luis);
    expect(await repository.findAll()).toEqual([first, second]);
  });

  it('finds a candidate by id and returns undefined when it does not exist', async () => {
    const saved = await repository.save(ana);
    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(9999)).toBeUndefined();
    expect(await repository.findById(99999999999)).toBeUndefined();
  });

  it('updates a candidate and returns undefined when it does not exist', async () => {
    const saved = await repository.save(ana);
    const changes = { ...luis, skills: ['Python'] };
    expect(await repository.update(saved.id, changes)).toEqual({ id: saved.id, ...changes });
    expect(await repository.findById(saved.id)).toEqual({ id: saved.id, ...changes });
    expect(await repository.update(9999, changes)).toBeUndefined();
  });

  it('removes a candidate and returns false when it does not exist', async () => {
    const saved = await repository.save(ana);
    expect(await repository.remove(saved.id)).toBe(true);
    expect(await repository.findById(saved.id)).toBeUndefined();
    expect(await repository.remove(saved.id)).toBe(false);
  });
});
