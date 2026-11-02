import { Pool } from 'pg';
import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

type CandidateRow = {
  id: number;
  name: string;
  email: string;
  city: string;
  experience_years: number;
  skills: string[];
};

const COLUMNS = 'id, name, email, city, experience_years, skills';
const MAX_INTEGER_ID = 2147483647;

const toCandidate = (row: CandidateRow): Candidate => ({
  id: row.id,
  name: row.name,
  email: row.email,
  city: row.city,
  experienceYears: row.experience_years,
  skills: row.skills,
});

const toParams = (candidate: NewCandidate): unknown[] => [
  candidate.name,
  candidate.email,
  candidate.city,
  candidate.experienceYears,
  candidate.skills,
];

const isValidId = (id: number): boolean => Number.isInteger(id) && id > 0 && id <= MAX_INTEGER_ID;

export const createPostgresCandidateRepository = (pool: Pool): CandidateRepository => {
  const findAll = async (): Promise<Candidate[]> => {
    const result = await pool.query<CandidateRow>(`SELECT ${COLUMNS} FROM candidates ORDER BY id`);
    return result.rows.map(toCandidate);
  };

  const findById = async (id: number): Promise<Candidate | undefined> => {
    if (!isValidId(id)) return undefined;
    const result = await pool.query<CandidateRow>(`SELECT ${COLUMNS} FROM candidates WHERE id = $1`, [id]);
    return result.rows[0] ? toCandidate(result.rows[0]) : undefined;
  };

  const save = async (candidate: NewCandidate): Promise<Candidate> => {
    const result = await pool.query<CandidateRow>(
      `INSERT INTO candidates (name, email, city, experience_years, skills)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      toParams(candidate),
    );
    return toCandidate(result.rows[0]);
  };

  const update = async (id: number, candidate: NewCandidate): Promise<Candidate | undefined> => {
    if (!isValidId(id)) return undefined;
    const result = await pool.query<CandidateRow>(
      `UPDATE candidates
       SET name = $1, email = $2, city = $3, experience_years = $4, skills = $5
       WHERE id = $6
       RETURNING ${COLUMNS}`,
      [...toParams(candidate), id],
    );
    return result.rows[0] ? toCandidate(result.rows[0]) : undefined;
  };

  const remove = async (id: number): Promise<boolean> => {
    if (!isValidId(id)) return false;
    const result = await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  };

  return { findAll, findById, save, update, remove };
};
