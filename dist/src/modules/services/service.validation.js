"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.listServicesQuerySchema = exports.updateServiceSchema = exports.createServiceSchema = void 0;
// export const createServiceSchema = z.object({
//   title: z.string().min(2).max(120).trim(),
//   slug: z
//     .string()
//     .min(2)
//     .max(120)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
//     .optional(),
//   description: z.string().min(20).trim(),
//   features: z.array(z.string().min(1).max(200)).max(20).optional(),
//   icon: z.string().max(80).optional(),
//   price: z.string().max(60).optional(),
//   order: z.number().int().min(0).optional(),
//   published: z.boolean().optional(),
// });
// export const updateServiceSchema = createServiceSchema.partial();
// export const listServicesQuerySchema = z.object({
//   published: z
//     .union([z.boolean(), z.enum(['true', 'false'])])
//     .transform((v) =>
//       v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined
//     )
//     .optional(),
//   search: z.string().trim().optional(),
// });
// export type CreateServiceInput = z.infer<typeof createServiceSchema>;
// export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
// export type ListServicesInput = z.infer<typeof listServicesQuerySchema>;
const zod_1 = require("zod");
exports.createServiceSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(120).trim(),
    slug: zod_1.z
        .string()
        .min(2)
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
        .optional(),
    description: zod_1.z.string().min(20).trim(),
    features: zod_1.z.array(zod_1.z.string().min(1).max(200)).max(20).optional(),
    icon: zod_1.z.string().max(80).optional(),
    price: zod_1.z.string().max(60).optional(),
    order: zod_1.z.number().int().min(0).optional(),
    published: zod_1.z.boolean().optional(),
});
exports.updateServiceSchema = exports.createServiceSchema.partial();
exports.listServicesQuerySchema = zod_1.z.object({
    published: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false'])])
        .transform((v) => v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined)
        .optional(),
    search: zod_1.z.string().trim().optional(),
});
