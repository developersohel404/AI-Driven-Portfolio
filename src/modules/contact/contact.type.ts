import { ContactMessage, ContactStatus } from '../../../generated/prisma/client';

export interface ContactListQuery {
  page?: number;
  limit?: number;
  status?: ContactStatus;
  search?: string;
}

export interface ContactListResult {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
