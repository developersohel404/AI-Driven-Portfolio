export interface ReviewInput {
  repoUrl: string;
  focus?: 'general' | 'security' | 'performance' | 'readability';
}

export interface ReviewFinding {
  file: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface ReviewReply {
  repo: string;
  reviewedFiles: string[];
  summary: string;
  findings: ReviewFinding[];
  provider: string;
  tokensIn: number;
  tokensOut: number;
  cached: boolean;
  disclaimer: string;
}
