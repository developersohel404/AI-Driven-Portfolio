export interface ExplainerReply {
  explanation: string;
  detectedLanguage: string | null;
  provider: string;
  tokensIn: number;
  tokensOut: number;
}
