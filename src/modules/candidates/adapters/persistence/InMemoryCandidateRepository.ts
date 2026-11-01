import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

const copy = (candidate: Candidate): Candidate => ({ ...candidate, skills: [...candidate.skills] });

export const createInMemoryCandidateRepository = (initial: Candidate[] = []): CandidateRepository => {
  const candidates: Candidate[] = initial.map(copy);
  let nextId = candidates.reduce((max, candidate) => Math.max(max, candidate.id), 0) + 1;

  const findAll = (): Candidate[] => candidates.map(copy);

  const findById = (id: number): Candidate | undefined => {
    const candidate = candidates.find((item) => item.id === id);
    return candidate ? copy(candidate) : undefined;
  };

  const save = (newCandidate: NewCandidate): Candidate => {
    const candidate: Candidate = copy({ id: nextId++, ...newCandidate });
    candidates.push(candidate);
    return copy(candidate);
  };

  const update = (id: number, data: NewCandidate): Candidate | undefined => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    candidates[index] = copy({ id, ...data });
    return copy(candidates[index]);
  };

  const remove = (id: number): boolean => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return false;
    candidates.splice(index, 1);
    return true;
  };

  return { findAll, findById, save, update, remove };
};
