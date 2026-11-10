import type { AIMessage } from '../../lib/ai/ai-provider';
import type { ReviewInput } from './reviewer.validation';

const SYSTEM_PROMPT = `You are a static code reviewer. You ONLY review the files given to you — nothing else.

RULES:
1. NEVER execute code. You only read and reason about it.
2. Output JSON only, with this exact shape:
{
  "summary": "1-3 sentences about the repo overall quality",
  "findings": [
    { "file": "path", "issue": "short issue", "severity": "low|medium|high", "suggestion": "how to fix" }
  ]
}
3. Max 8 findings. Sort by severity (high first).
4. Only report real, defensible issues you can see in the files.
5. Do NOT hallucinate vulnerabilities or lines.
6. Do NOT include a security audit — this is a limited demo, not a guarantee.
7. Focus area: {FOCUS}.`;

export function buildReviewerMessages(
  input: ReviewInput,
  files: Array<{ path: string; content: string }>
): AIMessage[] {
  const focus = input.focus ?? 'general';
  const system = SYSTEM_PROMPT.replace('{FOCUS}', focus);

  const filesBlock = files
    .map((f) => `### FILE: ${f.path}\n\`\`\`\n${f.content.slice(0, 8000)}\n\`\`\``)
    .join('\n\n');

  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `Review the following files from a public GitHub repository.\n\n${filesBlock}\n\nReturn JSON only.`,
    },
  ];
}

/** AI reply থেকে JSON নিরাপদভাবে extract */
export function parseReviewJson(text: string): {
  summary: string;
  findings: Array<{ file: string; issue: string; severity: string; suggestion: string }>;
} {
  // কখনো markdown fence থাকে
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    const obj = JSON.parse(cleaned);
    if (typeof obj.summary !== 'string' || !Array.isArray(obj.findings))
      throw new Error('bad shape');
    return {
      summary: obj.summary,
      findings: obj.findings
        .filter((f: any) => f && typeof f.issue === 'string' && typeof f.file === 'string')
        .slice(0, 8)
        .map((f: any) => ({
          file: String(f.file),
          issue: String(f.issue),
          severity: ['low', 'medium', 'high'].includes(f.severity) ? f.severity : 'medium',
          suggestion: String(f.suggestion ?? ''),
        })),
    };
  } catch {
    return {
      summary: 'AI could not produce a structured review.',
      findings: [],
    };
  }
}
