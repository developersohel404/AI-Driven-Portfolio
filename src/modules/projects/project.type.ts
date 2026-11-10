import { Project, ProjectStatus, ProjectTechnology } from '../../../generated/prisma/client';

export type ProjectWithTechs = Project & {
  technologies: ProjectTechnology[];
};

export interface ProjectListQuery {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  status?: ProjectStatus;
  includeDrafts?: boolean; // admin only
}

export interface ProjectListResult {
  items: ProjectWithTechs[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
