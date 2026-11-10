"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const logger_1 = require("../../config/logger");
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
exports.contactService = {
    async submit(input) {
        const message = await prisma_1.prisma.contactMessage.create({
            data: input,
        });
        // এখানে চাইলে free email service (যেমন Resend free tier) দিয়ে notification পাঠানো যায়
        // আপাতত শুধু log করি
        logger_1.logger.info({ contactId: message.id, email: message.email }, 'New contact message');
        return { id: message.id, createdAt: message.createdAt };
    },
    async list(input) {
        const { page, limit, status, search } = input;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma_1.prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma_1.prisma.contactMessage.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    },
    async getById(id) {
        const message = await prisma_1.prisma.contactMessage.findUnique({ where: { id } });
        if (!message)
            throw new error_handler_1.AppError('Contact message not found', 404);
        return message;
    },
    async updateStatus(id, status) {
        await this.getById(id);
        return prisma_1.prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
    },
    async remove(id) {
        await this.getById(id);
        await prisma_1.prisma.contactMessage.delete({ where: { id } });
    },
    async stats() {
        const [total, newCount] = await Promise.all([
            prisma_1.prisma.contactMessage.count(),
            prisma_1.prisma.contactMessage.count({ where: { status: 'NEW' } }),
        ]);
        return { total, newCount };
    },
};
