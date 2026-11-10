"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
const prisma_1 = require("../prisma");
const ai_provider_1 = require("./ai-provider");
const gemini_provider_1 = require("./providers/gemini.provider");
const ollama_provider_1 = require("./providers/ollama.provider");
const gemini = new gemini_provider_1.GeminiProvider();
const ollama = new ollama_provider_1.OllamaProvider();
/** priority order — যে আগে available, সে আগে */
const providers = [gemini, ollama];
function toPrismaProvider(name) {
    if (name === 'gemini')
        return 'GEMINI';
    if (name === 'ollama')
        return 'OLLAMA';
    return 'DISABLED';
}
exports.aiService = {
    /** কোন provider এখন লাইভ */
    getStatus() {
        return {
            configured: env_1.env.AI_PROVIDER,
            gemini: gemini.isAvailable(),
            ollama: ollama.isAvailable(),
            anyAvailable: providers.some((p) => p.isAvailable()),
        };
    },
    async generate(tool, messages, options) {
        const available = providers.filter((p) => p.isAvailable());
        if (available.length === 0) {
            throw new ai_provider_1.AIProviderError('No AI provider is currently available.', 'PROVIDER_UNAVAILABLE', 'none');
        }
        let lastError = null;
        for (const provider of available) {
            try {
                const result = await provider.generate(messages, options);
                // সফল হলে usage log
                await prisma_1.prisma.aIUsageLog
                    .create({
                    data: {
                        tool,
                        provider: toPrismaProvider(provider.name),
                        tokensIn: result.tokensIn,
                        tokensOut: result.tokensOut,
                        success: true,
                    },
                })
                    .catch((e) => logger_1.logger.warn({ e }, 'Failed to write AI usage log'));
                return result;
            }
            catch (err) {
                lastError = err;
                // কোটা শেষ হলে পরের provider চেষ্টা করা বন্ধ (সাধারণত সবাই একই সমস্যায়)
                if (err instanceof ai_provider_1.AIProviderError && err.code === 'QUOTA_EXHAUSTED') {
                    await this.logFailure(tool, provider.name, err);
                    throw err;
                }
                logger_1.logger.warn({ provider: provider.name, err }, 'Provider failed, trying next');
            }
        }
        // সবাই ফেইল
        await this.logFailure(tool, 'none', lastError);
        throw lastError instanceof ai_provider_1.AIProviderError
            ? lastError
            : new ai_provider_1.AIProviderError('All AI providers failed.', 'PROVIDER_UNAVAILABLE', 'none');
    },
    async logFailure(tool, providerName, err) {
        const message = err instanceof ai_provider_1.AIProviderError ? `${err.code}: ${err.message}` : String(err);
        await prisma_1.prisma.aIUsageLog
            .create({
            data: {
                tool,
                provider: toPrismaProvider(providerName),
                success: false,
                errorMessage: message,
            },
        })
            .catch((e) => logger_1.logger.warn({ e }, 'Failed to write AI failure log'));
    },
    /** admin dashboard-এর জন্য — শেষ ২৪ ঘণ্টার usage */
    async getUsageStats() {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [total, failures, byTool] = await Promise.all([
            prisma_1.prisma.aIUsageLog.count({ where: { createdAt: { gte: since } } }),
            prisma_1.prisma.aIUsageLog.count({
                where: { createdAt: { gte: since }, success: false },
            }),
            prisma_1.prisma.aIUsageLog.groupBy({
                by: ['tool'],
                where: { createdAt: { gte: since } },
                _count: true,
            }),
        ]);
        return { total, failures, byTool, windowHours: 24 };
    },
};
