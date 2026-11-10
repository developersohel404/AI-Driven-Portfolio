import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import type { AIGenerateOptions, AIGenerateResult, AIMessage, AIProvider } from '../ai-provider';
import { AIProviderError } from '../ai-provider';

export class OllamaProvider implements AIProvider {
  name = 'ollama' as const;

  isAvailable(): boolean {
    return env.AI_PROVIDER === 'ollama';
  }

  async generate(
    messages: AIMessage[],
    options: AIGenerateOptions = {}
  ): Promise<AIGenerateResult> {
    try {
      const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: env.OLLAMA_MODEL,
          messages,
          stream: false,
          options: {
            num_predict: options.maxOutputTokens ?? 800,
            temperature: options.temperature ?? 0.7,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Ollama ${response.status}: ${body}`);
      }

      const data = (await response.json()) as {
        message?: { content?: string };
        prompt_eval_count?: number;
        eval_count?: number;
      };

      const text = data.message?.content;
      if (!text) {
        throw new AIProviderError('Ollama returned empty response', 'INVALID_RESPONSE', this.name);
      }

      return {
        text,
        provider: this.name,
        tokensIn: data.prompt_eval_count ?? 0,
        tokensOut: data.eval_count ?? 0,
      };
    } catch (err: any) {
      if (err instanceof AIProviderError) throw err;
      logger.error({ err }, 'Ollama generation failed');
      throw new AIProviderError(
        'Local AI is not available. Make sure Ollama is running.',
        'PROVIDER_UNAVAILABLE',
        this.name
      );
    }
  }
}
