"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantService = void 0;
const constants_1 = require("../../config/constants");
const logger_1 = require("../../config/logger");
const ai_provider_1 = require("../../lib/ai/ai-provider");
const ai_service_1 = require("../../lib/ai/ai-service");
const prisma_1 = require("../../lib/prisma");
const assistant_context_1 = require("./assistant.context");
const assistant_prompt_1 = require("./assistant.prompt");
/** খালি/সন্দেহজনক session id-এর জন্য নতুন session */
function newSessionId() {
    return crypto.randomUUID();
}
exports.assistantService = {
    /**
     * Main chat handler।
     * - sessionId না দিলে নতুন তৈরি
     * - past messages DB থেকে নেয়
     * - portfolio context retrieve করে
     * - provider-এ পাঠায়
     * - reply + assistant message store করে
     */
    async chat(input) {
        const sessionId = input.sessionId ?? newSessionId();
        // Conversation তৈরি/খুঁজে নাও
        let conversation = await prisma_1.prisma.aIConversation.findUnique({
            where: { sessionId },
            include: { messages: { orderBy: { createdAt: 'asc' }, take: 12 } },
        });
        if (!conversation) {
            conversation = await prisma_1.prisma.aIConversation.create({
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
        const context = await (0, assistant_context_1.buildPortfolioContext)(input.message);
        const history = conversation.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const messages = (0, assistant_prompt_1.buildAssistantMessages)(context, input.message, history);
        // AI কল
        let result;
        try {
            result = await ai_service_1.aiService.generate('ASSISTANT', messages, {
                maxOutputTokens: constants_1.AI_LIMITS.MAX_OUTPUT_TOKENS,
                temperature: 0.6,
            });
        }
        catch (err) {
            // quota শেষ হলে user-friendlyভাবে রিলে
            if (err instanceof ai_provider_1.AIProviderError && err.code === 'QUOTA_EXHAUSTED') {
                throw err;
            }
            logger_1.logger.error({ err }, 'Assistant AI call failed');
            throw err;
        }
        // Save messages + update conversation
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.aIMessage.create({
                data: {
                    conversationId: conversation.id,
                    role: 'user',
                    content: input.message,
                },
            }),
            prisma_1.prisma.aIMessage.create({
                data: {
                    conversationId: conversation.id,
                    role: 'assistant',
                    content: result.text,
                    tokensUsed: result.tokensOut,
                },
            }),
            prisma_1.prisma.aIConversation.update({
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
    async getHistory(sessionId) {
        const conv = await prisma_1.prisma.aIConversation.findUnique({
            where: { sessionId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
            },
        });
        if (!conv)
            return null;
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
