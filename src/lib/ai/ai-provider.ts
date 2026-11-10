export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIGenerateOptions {
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AIGenerateResult {
  text: string;
  provider: 'gemini' | 'ollama';
  tokensIn: number;
  tokensOut: number;
}

export interface AIProvider {
  name: 'gemini' | 'ollama';
  isAvailable(): boolean;
  generate(messages: AIMessage[], options?: AIGenerateOptions): Promise<AIGenerateResult>;
}

/** provider-নিরপেক্ষ ত্রুটি — controller এটাই ধরে ফ্রেন্ডলি মেসেজ দেখাবে */
export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code:
      'QUOTA_EXHAUSTED' | 'PROVIDER_UNAVAILABLE' | 'INVALID_RESPONSE' | 'UNKNOWN',
    public readonly provider: string
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}
