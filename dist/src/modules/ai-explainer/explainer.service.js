"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainerService = void 0;
const constants_1 = require("../../config/constants");
const ai_service_1 = require("../../lib/ai/ai-service");
const explainer_prompt_1 = require("./explainer.prompt");
const LANGUAGE_HINTS = [
    { name: 'TypeScript', regex: /\b(interface|type\s+\w+\s*=|:\s*(string|number|boolean)\b)/ },
    { name: 'JavaScript', regex: /\b(const|let|var|function|=>|console\.log)\b/ },
    { name: 'Python', regex: /(^\s*def\s+|^\s*import\s+|^\s*from\s+.*import|print\()/m },
    { name: 'Java', regex: /\b(public\s+class|System\.out\.println)\b/ },
    { name: 'C#', regex: /\b(using\s+System|Console\.WriteLine)\b/ },
    { name: 'Go', regex: /\b(func\s+\w+\(|package\s+main|fmt\.Print)/ },
    { name: 'Rust', regex: /\b(fn\s+\w+\(|let\s+mut|println!)/ },
    { name: 'PHP', regex: /<\?php|\$\w+\s*=/ },
    { name: 'SQL', regex: /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/i },
    { name: 'HTML', regex: /<(html|div|span|body|head)[\s>]/i },
    { name: 'CSS', regex: /[.#]\w+\s*\{[^}]*:[^}]*\}/ },
];
function detectLanguage(code) {
    for (const { name, regex } of LANGUAGE_HINTS) {
        if (regex.test(code))
            return name;
    }
    return null;
}
/** খুব লম্বা লাইন ভেঙে দিই যাতে provider-এ সমস্যা না হয় */
function normalizeCode(code) {
    return code
        .split('\n')
        .map((line) => (line.length > 500 ? line.slice(0, 500) + '...' : line))
        .join('\n');
}
exports.explainerService = {
    async explain(input) {
        const detected = detectLanguage(input.code);
        const messages = (0, explainer_prompt_1.buildExplainerMessages)({
            code: normalizeCode(input.code),
            language: input.language ?? detected ?? undefined,
            question: input.question,
        });
        const result = await ai_service_1.aiService.generate('CODE_EXPLAIN', messages, {
            maxOutputTokens: constants_1.AI_LIMITS.MAX_OUTPUT_TOKENS,
            temperature: 0.3,
        });
        return {
            explanation: result.text,
            detectedLanguage: detected,
            provider: result.provider,
            tokensIn: result.tokensIn,
            tokensOut: result.tokensOut,
        };
    },
};
