"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCaseStudyMessages = buildCaseStudyMessages;
exports.parseCaseStudyJson = parseCaseStudyJson;
const SYSTEM_PROMPT = `You generate structured case studies from project material.

RULES:
1. Output JSON only, with exactly these keys: problem, goals, solution, architecture, decisions, challenges, lessonsLearned, futureWork.
2. Each value: 2-6 sentences, plain text (no markdown headings inside).
3. Base everything on the material given. Do NOT invent team size, metrics, or impact.
4. If information is missing for a field, write a short honest note like "Not documented yet." — do not fill with fluff.
5. Do NOT claim you inspected the whole repository. You only see the pasted material.
6. Keep total output under 900 words.`;
function buildCaseStudyMessages(input) {
    const parts = [];
    if (input.readme)
        parts.push(`--- README ---\n${input.readme.slice(0, 8000)}`);
    if (input.description)
        parts.push(`--- DESCRIPTION ---\n${input.description}`);
    if (input.techStack?.length)
        parts.push(`--- TECH ---\n${input.techStack.join(', ')}`);
    if (input.problem)
        parts.push(`--- PROBLEM (user-supplied) ---\n${input.problem}`);
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: `Generate a case study JSON from this material.\n\n${parts.join('\n\n')}`,
        },
    ];
}
/** AI text থেকে safe JSON → CaseStudyDraft */
function parseCaseStudyJson(text) {
    const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
    try {
        const obj = JSON.parse(cleaned);
        const pick = (k, fallback = 'Not documented yet.') => typeof obj?.[k] === 'string' && obj[k].trim().length > 0 ? obj[k].trim() : fallback;
        return {
            problem: pick('problem'),
            goals: pick('goals'),
            solution: pick('solution'),
            architecture: pick('architecture'),
            decisions: pick('decisions'),
            challenges: pick('challenges'),
            lessonsLearned: pick('lessonsLearned'),
            futureWork: pick('futureWork'),
        };
    }
    catch {
        return {
            problem: 'Not documented yet.',
            goals: 'Not documented yet.',
            solution: 'Not documented yet.',
            architecture: 'Not documented yet.',
            decisions: 'Not documented yet.',
            challenges: 'Not documented yet.',
            lessonsLearned: 'Not documented yet.',
            futureWork: 'Not documented yet.',
        };
    }
}
