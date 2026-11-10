import { logger } from '../../config/logger';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import type { ContactListResult } from './contact.type';
import type { ListContactsInput, SubmitContactInput } from './contact.validation';

export const contactService = {
  async submit(input: SubmitContactInput) {
    const message = await prisma.contactMessage.create({
      data: input,
    });

    // এখানে চাইলে free email service (যেমন Resend free tier) দিয়ে notification পাঠানো যায়
    // আপাতত শুধু log করি
    logger.info({ contactId: message.id, email: message.email }, 'New contact message');

    return { id: message.id, createdAt: message.createdAt };
  },

  async list(input: ListContactsInput): Promise<ContactListResult> {
    const { page, limit, status, search } = input;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getById(id: string) {
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new AppError('Contact message not found', 404);
    return message;
  },

  async updateStatus(id: string, status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED') {
    await this.getById(id);
    return prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.contactMessage.delete({ where: { id } });
  },

  async stats() {
    const [total, newCount] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
    ]);
    return { total, newCount };
  },
};
