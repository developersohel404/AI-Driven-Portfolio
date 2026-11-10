import { Service } from '../../../generated/prisma/client';

export interface ServiceListQuery {
  published?: boolean;
  search?: string;
}

export interface ServiceListResult {
  items: Service[];
  total: number;
}
