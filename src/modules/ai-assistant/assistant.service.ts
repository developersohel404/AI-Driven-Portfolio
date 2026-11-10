import { AI_LIMITS } from '../../config/constants';
import { logger } from '../../config/logger';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { aiService } from '../../lib/ai/ai-service';
import { prisma } from '../../lib/prisma';
import { buildPortfolioContext } from './assistant.context';
import { buildAssistantMessages } from './assistant.prompt';
import type { AssistantReply } from './assistant.type';

/** খালি/সন্দেহজনক session id-এর জন্য নতুন session */
function newSessionId(): string {
  return crypto.randomUUID();
}

export const assistantService = {
  /**
   * Main chat handler।
   * - sessionId না দিলে নতুন তৈরি
   * - past messages DB থেকে নেয়
   * - portfolio context retrieve করে
   * - provider-এ পাঠায়
   * - reply + assistant message store করে
   */
  async chat(input: {
    sessionId?: string;
    message: string;
    userId?: string;
    ip?: string;
  }): Promise<AssistantReply> {
    const sessionId = input.sessionId ?? newSessionId();

    // Conversation তৈরি/খুঁজে নাও
    let conversation = await prisma.aIConversation.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 12 } },
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          sessionId,
          userId: input.userId,
          provider: 'DISABLED', // রিয়েল provider rersponse-এ আপডেট হবে
          title: input.message.slice(0, 80),
        },
        include: { messages: true },
      });
    }

    // Context + messages তৈরি
    const context = await buildPortfolioContext(input.message);
    const history = conversation.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const messages = buildAssistantMessages(context, input.message, history);

    // AI কল
    let result;
    try {
      result = await aiService.generate('ASSISTANT', messages, {
        maxOutputTokens: AI_LIMITS.MAX_OUTPUT_TOKENS,
        temperature: 0.6,
      });
    } catch (err) {
      // quota শেষ হলে user-friendlyভাবে রিলে
      if (err instanceof AIProviderError && err.code === 'QUOTA_EXHAUSTED') {
        throw err;
      }
      logger.error({ err }, 'Assistant AI call failed');
      throw err;
    }

    // Save messages + update conversation
    await prisma.$transaction([
      prisma.aIMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: input.message,
        },
      }),
      prisma.aIMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: result.text,
          tokensUsed: result.tokensOut,
        },
      }),
      prisma.aIConversation.update({
        where: { id: conversation.id },
        data: { provider: result.provider === 'gemini' ? 'GEMINI' : 'OLLAMA' },
      }),
    ]);

    return {
      sessionId,
      answer: result.text,
      provider: result.provider,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      contextUsed: {
        projects: context.projects.length,
        skills: Object.values(context.skills).flat().length,
        services: context.services.length,
        hasProfile: !!context.profile,
      },
    };
  },

  /** session-এর past messages দেখতে */
  async getHistory(sessionId: string) {
    const conv = await prisma.aIConversation.findUnique({
      where: { sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!conv) return null;
    return {
      sessionId: conv.sessionId,
      title: conv.title,
      provider: conv.provider,
      messages: conv.messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  },
};
