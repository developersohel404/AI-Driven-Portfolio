export interface CaseStudyDraft {
  problem: string;
  goals: string;
  solution: string;
  architecture: string;
  decisions: string;
  challenges: string;
  lessonsLearned: string;
  futureWork: string;
}

export interface CaseStudyGenerateResult {
  draft: CaseStudyDraft;
  provider: string;
  tokensIn: number;
  tokensOut: number;
  sourceKind: 'readme' | 'manual';
  saved: boolean;
  projectId: string;
}
