import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

const copy = (candidate: Candidate): Candidate => ({ ...candidate, skills: [...candidate.skills] });

export const createInMemoryCandidateRepository = (initial: Candidate[] = []): CandidateRepository => {
  const candidates: Candidate[] = initial.map(copy);
  let nextId = candidates.reduce((max, candidate) => Math.max(max, candidate.id), 0) + 1;

  const findAll = async (): Promise<Candidate[]> => candidates.map(copy);

  const findById = async (id: number): Promise<Candidate | undefined> => {
    const candidate = candidates.find((item) => item.id === id);
    return candidate ? copy(candidate) : undefined;
  };

  const save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const candidate: Candidate = copy({ id: nextId++, ...newCandidate });
    candidates.push(candidate);
    return copy(candidate);
  };

  const update = async (id: number, data: NewCandidate): Promise<Candidate | undefined> => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    candidates[index] = copy({ id, ...data });
    return copy(candidates[index]);
  };

  const remove = async (id: number): Promise<boolean> => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return false;
    candidates.splice(index, 1);
    return true;
  };

  return { findAll, findById, save, update, remove };
};
