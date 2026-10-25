import { Candidate, NewCandidate } from '../domain/Candidate';

export type CandidateRepository = {
  findAll: () => Candidate[];
  findById: (id: number) => Candidate | undefined;
  save: (candidate: NewCandidate) => Candidate;
  update: (id: number, candidate: NewCandidate) => Candidate | undefined;
  remove: (id: number) => boolean;
};
