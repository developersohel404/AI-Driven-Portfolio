"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const genai_1 = require("@google/genai");
const env_1 = require("../../../config/env");
const logger_1 = require("../../../config/logger");
const ai_provider_1 = require("../ai-provider");
const MODEL_FALLBACK_CHAIN = [env_1.env.GEMINI_MODEL, 'gemini-2.5-flash-lite', 'gemini-3.5-flash'].filter(Boolean);
class GeminiProvider {
    name = 'gemini';
    client = null;
    constructor() {
        if (env_1.env.GEMINI_API_KEY) {
            this.client = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
        }
    }
    isAvailable() {
        return !!this.client && env_1.env.AI_PROVIDER === 'gemini';
    }
    async generate(messages, options = {}) {
        if (!this.client) {
            throw new ai_provider_1.AIProviderError('Gemini provider is not configured', 'PROVIDER_UNAVAILABLE', this.name);
        }
        const systemMsg = messages.find((m) => m.role === 'system')?.content;
        const chatMessages = messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        let lastError = null;
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
                    throw new ai_provider_1.AIProviderError('Gemini returned empty response', 'INVALID_RESPONSE', this.name);
                }
                logger_1.logger.info({ model }, 'Gemini generation succeeded');
                return {
                    text,
                    provider: this.name,
                    tokensIn: response.usageMetadata?.promptTokenCount ?? 0,
                    tokensOut: response.usageMetadata?.candidatesTokenCount ?? 0,
                };
            }
            catch (err) {
                lastError = err;
                const status = err?.status ?? err?.code;
                if (status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED')) {
                    throw new ai_provider_1.AIProviderError('AI quota exhausted. Please try again later.', 'QUOTA_EXHAUSTED', this.name);
                }
                if (status === 404 || err?.message?.includes('not found')) {
                    logger_1.logger.warn({ model, err: err?.message }, 'Gemini model unavailable, trying next');
                    continue;
                }
                logger_1.logger.error({ model, err }, 'Gemini generation failed');
                throw new ai_provider_1.AIProviderError(err?.message ?? 'Gemini request failed', 'UNKNOWN', this.name);
            }
        }
        throw new ai_provider_1.AIProviderError('No available Gemini model responded', 'PROVIDER_UNAVAILABLE', this.name);
    }
}
exports.GeminiProvider = GeminiProvider;
