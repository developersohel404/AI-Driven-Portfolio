import type { AIToolType, AIProvider as PrismaAIProvider } from '../../../generated/prisma/client';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { prisma } from '../prisma';
import type { AIGenerateOptions, AIGenerateResult, AIMessage, AIProvider } from './ai-provider';
import { AIProviderError } from './ai-provider';
import { GeminiProvider } from './providers/gemini.provider';
import { OllamaProvider } from './providers/ollama.provider';

const gemini = new GeminiProvider();
const ollama = new OllamaProvider();

/** priority order — যে আগে available, সে আগে */
const providers: AIProvider[] = [gemini, ollama];

function toPrismaProvider(name: string): PrismaAIProvider {
  if (name === 'gemini') return 'GEMINI';
  if (name === 'ollama') return 'OLLAMA';
  return 'DISABLED';
}

export const aiService = {
  /** কোন provider এখন লাইভ */
  getStatus() {
    return {
      configured: env.AI_PROVIDER,
      gemini: gemini.isAvailable(),
      ollama: ollama.isAvailable(),
      anyAvailable: providers.some((p) => p.isAvailable()),
    };
  },

  async generate(
    tool: AIToolType,
    messages: AIMessage[],
    options?: AIGenerateOptions
  ): Promise<AIGenerateResult> {
    const available = providers.filter((p) => p.isAvailable());

    if (available.length === 0) {
      throw new AIProviderError(
        'No AI provider is currently available.',
        'PROVIDER_UNAVAILABLE',
        'none'
      );
    }

    let lastError: unknown = null;

    for (const provider of available) {
      try {
        const result = await provider.generate(messages, options);

        // সফল হলে usage log
        await prisma.aIUsageLog
          .create({
            data: {
              tool,
              provider: toPrismaProvider(provider.name),
              tokensIn: result.tokensIn,
              tokensOut: result.tokensOut,
              success: true,
            },
          })
          .catch((e) => logger.warn({ e }, 'Failed to write AI usage log'));

        return result;
      } catch (err) {
        lastError = err;

        // কোটা শেষ হলে পরের provider চেষ্টা করা বন্ধ (সাধারণত সবাই একই সমস্যায়)
        if (err instanceof AIProviderError && err.code === 'QUOTA_EXHAUSTED') {
          await this.logFailure(tool, provider.name, err);
          throw err;
        }

        logger.warn({ provider: provider.name, err }, 'Provider failed, trying next');
      }
    }

    // সবাই ফেইল
    await this.logFailure(tool, 'none', lastError);
    throw lastError instanceof AIProviderError
      ? lastError
      : new AIProviderError('All AI providers failed.', 'PROVIDER_UNAVAILABLE', 'none');
  },

  async logFailure(tool: AIToolType, providerName: string, err: unknown) {
    const message = err instanceof AIProviderError ? `${err.code}: ${err.message}` : String(err);

    await prisma.aIUsageLog
      .create({
        data: {
          tool,
          provider: toPrismaProvider(providerName),
          success: false,
          errorMessage: message,
        },
      })
      .catch((e) => logger.warn({ e }, 'Failed to write AI failure log'));
  },

  /** admin dashboard-এর জন্য — শেষ ২৪ ঘণ্টার usage */
  async getUsageStats() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [total, failures, byTool] = await Promise.all([
      prisma.aIUsageLog.count({ where: { createdAt: { gte: since } } }),
      prisma.aIUsageLog.count({
        where: { createdAt: { gte: since }, success: false },
      }),
      prisma.aIUsageLog.groupBy({
        by: ['tool'],
        where: { createdAt: { gte: since } },
        _count: true,
      }),
    ]);
    return { total, failures, byTool, windowHours: 24 };
  },
};
