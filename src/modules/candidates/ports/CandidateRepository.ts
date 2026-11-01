import { Candidate, NewCandidate } from '../domain/Candidate';

export type CandidateRepository = {
  findAll: () => Promise<Candidate[]>;
  findById: (id: number) => Promise<Candidate | undefined>;
  save: (candidate: NewCandidate) => Promise<Candidate>;
  update: (id: number, candidate: NewCandidate) => Promise<Candidate | undefined>;
  remove: (id: number) => Promise<boolean>;
};
