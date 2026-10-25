import { NotFoundError } from '../../../shared/NotFoundError';
import { Candidate, parseNewCandidate } from '../domain/Candidate';
import { CandidateRepository } from '../ports/CandidateRepository';

export type CandidateService = {
  list: () => Candidate[];
  getById: (id: number) => Candidate;
  create: (input: unknown) => Candidate;
  update: (id: number, input: unknown) => Candidate;
  remove: (id: number) => void;
};

const CANDIDATE_NOT_FOUND = 'Candidato no encontrado';

export const createCandidateService = (repository: CandidateRepository): CandidateService => {
  const list = (): Candidate[] => repository.findAll();

  const getById = (id: number): Candidate => {
    const candidate = repository.findById(id);
    if (!candidate) throw new NotFoundError(CANDIDATE_NOT_FOUND);
    return candidate;
  };

  const create = (input: unknown): Candidate => repository.save(parseNewCandidate(input));

  const update = (id: number, input: unknown): Candidate => {
    const data = parseNewCandidate(input);
    const updated = repository.update(id, data);
    if (!updated) throw new NotFoundError(CANDIDATE_NOT_FOUND);
    return updated;
  };

  const remove = (id: number): void => {
    if (!repository.remove(id)) throw new NotFoundError(CANDIDATE_NOT_FOUND);
  };

  return { list, getById, create, update, remove };
};
