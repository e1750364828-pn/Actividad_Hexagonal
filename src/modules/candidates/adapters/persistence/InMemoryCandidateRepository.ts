import { Candidate, NewCandidate } from '../../domain/Candidate';
import { CandidateRepository } from '../../ports/CandidateRepository';

export const createInMemoryCandidateRepository = (initial: Candidate[] = []): CandidateRepository => {
  const candidates: Candidate[] = initial.map((candidate) => ({ ...candidate }));
  let nextId = candidates.reduce((max, candidate) => Math.max(max, candidate.id), 0) + 1;

  const findAll = (): Candidate[] => candidates.map((candidate) => ({ ...candidate }));

  const findById = (id: number): Candidate | undefined => {
    const candidate = candidates.find((item) => item.id === id);
    return candidate ? { ...candidate } : undefined;
  };

  const save = (newCandidate: NewCandidate): Candidate => {
    const candidate: Candidate = { id: nextId++, ...newCandidate };
    candidates.push(candidate);
    return { ...candidate };
  };

  const update = (id: number, data: NewCandidate): Candidate | undefined => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    candidates[index] = { id, ...data };
    return { ...candidates[index] };
  };

  const remove = (id: number): boolean => {
    const index = candidates.findIndex((item) => item.id === id);
    if (index === -1) return false;
    candidates.splice(index, 1);
    return true;
  };

  return { findAll, findById, save, update, remove };
};
