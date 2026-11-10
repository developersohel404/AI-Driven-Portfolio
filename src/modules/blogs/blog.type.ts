import { BlogPost, BlogStatus, BlogTag, User } from '../../../generated/prisma/client';

export type BlogPostWithTags = BlogPost & {
  tags: BlogTag[];
  author?: Pick<User, 'id' | 'name' | 'email'>;
};

export interface BlogListQuery {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: BlogStatus;
  includeDrafts?: boolean;
}

export interface BlogListResult {
  items: BlogPostWithTags[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
