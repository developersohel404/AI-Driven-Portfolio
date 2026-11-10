"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProvider = void 0;
const env_1 = require("../../../config/env");
const logger_1 = require("../../../config/logger");
const ai_provider_1 = require("../ai-provider");
class OllamaProvider {
    name = 'ollama';
    isAvailable() {
        return env_1.env.AI_PROVIDER === 'ollama';
    }
    async generate(messages, options = {}) {
        try {
            const response = await fetch(`${env_1.env.OLLAMA_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: env_1.env.OLLAMA_MODEL,
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
            const data = (await response.json());
            const text = data.message?.content;
            if (!text) {
                throw new ai_provider_1.AIProviderError('Ollama returned empty response', 'INVALID_RESPONSE', this.name);
            }
            return {
                text,
                provider: this.name,
                tokensIn: data.prompt_eval_count ?? 0,
                tokensOut: data.eval_count ?? 0,
            };
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError)
                throw err;
            logger_1.logger.error({ err }, 'Ollama generation failed');
            throw new ai_provider_1.AIProviderError('Local AI is not available. Make sure Ollama is running.', 'PROVIDER_UNAVAILABLE', this.name);
        }
    }
}
exports.OllamaProvider = OllamaProvider;
