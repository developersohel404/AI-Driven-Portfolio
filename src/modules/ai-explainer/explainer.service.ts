import { AI_LIMITS } from '../../config/constants';
import { aiService } from '../../lib/ai/ai-service';
import { buildExplainerMessages } from './explainer.prompt';
import type { ExplainerReply } from './explainer.type';
import type { ExplainInput } from './explainer.validation';

const LANGUAGE_HINTS: Array<{ name: string; regex: RegExp }> = [
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

function detectLanguage(code: string): string | null {
  for (const { name, regex } of LANGUAGE_HINTS) {
    if (regex.test(code)) return name;
  }
  return null;
}

/** খুব লম্বা লাইন ভেঙে দিই যাতে provider-এ সমস্যা না হয় */
function normalizeCode(code: string): string {
  return code
    .split('\n')
    .map((line) => (line.length > 500 ? line.slice(0, 500) + '...' : line))
    .join('\n');
}

export const explainerService = {
  async explain(input: ExplainInput): Promise<ExplainerReply> {
    const detected = detectLanguage(input.code);
    const messages = buildExplainerMessages({
      code: normalizeCode(input.code),
      language: input.language ?? detected ?? undefined,
      question: input.question,
    });

    const result = await aiService.generate('CODE_EXPLAIN', messages, {
      maxOutputTokens: AI_LIMITS.MAX_OUTPUT_TOKENS,
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
