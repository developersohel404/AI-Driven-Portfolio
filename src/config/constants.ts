export const APP_NAME = 'Sohel.dev API';
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const AI_LIMITS = {
  MAX_INPUT_CHARS: 4000,
  MAX_OUTPUT_TOKENS: 800,
  MAX_CONTEXT_ITEMS: 5,
};

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
