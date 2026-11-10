import { GoogleGenAI } from '@google/genai';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import type { AIGenerateOptions, AIGenerateResult, AIMessage, AIProvider } from '../ai-provider';
import { AIProviderError } from '../ai-provider';

const MODEL_FALLBACK_CHAIN = [env.GEMINI_MODEL, 'gemini-2.5-flash-lite', 'gemini-3.5-flash'].filter(
  Boolean
);

export class GeminiProvider implements AIProvider {
  name = 'gemini' as const;
  private client: GoogleGenAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
  }

  isAvailable(): boolean {
    return !!this.client && env.AI_PROVIDER === 'gemini';
  }

  async generate(
    messages: AIMessage[],
    options: AIGenerateOptions = {}
  ): Promise<AIGenerateResult> {
    if (!this.client) {
      throw new AIProviderError(
        'Gemini provider is not configured',
        'PROVIDER_UNAVAILABLE',
        this.name
      );
    }

    const systemMsg = messages.find((m) => m.role === 'system')?.content;
    const chatMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    let lastError: unknown = null;

    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        const response = await this.client.models.generateContent({
          model,
          contents: chatMessages,
          config: {
            systemInstruction: systemMsg,
            maxOutputTokens: options.maxOutputTokens ?? 800,
            temperature: options.temperature ?? 0.7,
          },
        });

        const text = response.text;
        if (!text) {
          throw new AIProviderError(
            'Gemini returned empty response',
            'INVALID_RESPONSE',
            this.name
          );
        }

        logger.info({ model }, 'Gemini generation succeeded');
        return {
          text,
          provider: this.name,
          tokensIn: response.usageMetadata?.promptTokenCount ?? 0,
          tokensOut: response.usageMetadata?.candidatesTokenCount ?? 0,
        };
      } catch (err: any) {
        lastError = err;
        const status = err?.status ?? err?.code;

        if (status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED')) {
          throw new AIProviderError(
            'AI quota exhausted. Please try again later.',
            'QUOTA_EXHAUSTED',
            this.name
          );
        }

        if (status === 404 || err?.message?.includes('not found')) {
          logger.warn({ model, err: err?.message }, 'Gemini model unavailable, trying next');
          continue;
        }

        logger.error({ model, err }, 'Gemini generation failed');
        throw new AIProviderError(err?.message ?? 'Gemini request failed', 'UNKNOWN', this.name);
      }
    }

    throw new AIProviderError(
      'No available Gemini model responded',
      'PROVIDER_UNAVAILABLE',
      this.name
    );
  }
}
