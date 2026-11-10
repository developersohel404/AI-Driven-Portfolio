import { Skill } from '../../../generated/prisma/client';

export interface SkillListQuery {
  category?: string;
  search?: string;
}

export interface SkillListResult {
  items: Skill[];
  total: number;
}
