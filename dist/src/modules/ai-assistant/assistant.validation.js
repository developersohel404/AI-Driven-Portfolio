"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatInputSchema = void 0;
// export const chatInputSchema = z.object({
//   sessionId: z.string().uuid().optional(),
//   message: z.string().min(1).max(2000).trim(),
// });
// export type ChatInput = z.infer<typeof chatInputSchema>;
const zod_1 = require("zod");
exports.chatInputSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid().optional(),
    message: zod_1.z.string().min(1).max(2000).trim(),
});
