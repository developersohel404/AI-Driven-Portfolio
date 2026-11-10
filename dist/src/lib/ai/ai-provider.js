"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderError = void 0;
/** provider-নিরপেক্ষ ত্রুটি — controller এটাই ধরে ফ্রেন্ডলি মেসেজ দেখাবে */
class AIProviderError extends Error {
    code;
    provider;
    constructor(message, code, provider) {
        super(message);
        this.code = code;
        this.provider = provider;
        this.name = 'AIProviderError';
    }
}
exports.AIProviderError = AIProviderError;
