import { NotFoundError } from '../../../shared/NotFoundError';
import { Candidate, parseNewCandidate } from '../domain/Candidate';
import { CandidateRepository } from '../ports/CandidateRepository';

export type CandidateService = {
  list: () => Promise<Candidate[]>;
  getById: (id: number) => Promise<Candidate>;
  create: (input: unknown) => Promise<Candidate>;
  update: (id: number, input: unknown) => Promise<Candidate>;
  remove: (id: number) => Promise<void>;
};

const CANDIDATE_NOT_FOUND = 'Candidato no encontrado';

export const createCandidateService = (repository: CandidateRepository): CandidateService => {
  const list = (): Promise<Candidate[]> => repository.findAll();

  const getById = async (id: number): Promise<Candidate> => {
    const candidate = await repository.findById(id);
    if (!candidate) throw new NotFoundError(CANDIDATE_NOT_FOUND);
    return candidate;
  };

  const create = async (input: unknown): Promise<Candidate> => repository.save(parseNewCandidate(input));

  const update = async (id: number, input: unknown): Promise<Candidate> => {
    const data = parseNewCandidate(input);
    const updated = await repository.update(id, data);
    if (!updated) throw new NotFoundError(CANDIDATE_NOT_FOUND);
    return updated;
  };

  const remove = async (id: number): Promise<void> => {
    if (!(await repository.remove(id))) throw new NotFoundError(CANDIDATE_NOT_FOUND);
  };

  return { list, getById, create, update, remove };
};
