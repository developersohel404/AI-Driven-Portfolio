"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    headline: zod_1.z.string().min(5).max(160).trim().nullish(),
    shortBio: zod_1.z.string().min(10).max(300).trim().nullish(),
    bio: zod_1.z.string().min(20).trim().nullish(),
    location: zod_1.z.string().max(80).trim().nullish(),
    email: zod_1.z.string().email().nullish(),
    phone: zod_1.z.string().max(30).trim().nullish(),
    avatarUrl: zod_1.z.string().url().nullish(),
    resumeUrl: zod_1.z.string().url().nullish(),
    githubUrl: zod_1.z.string().url().nullish(),
    linkedinUrl: zod_1.z.string().url().nullish(),
    twitterUrl: zod_1.z.string().url().nullish(),
    websiteUrl: zod_1.z.string().url().nullish(),
    availableForWork: zod_1.z.boolean().nullish(),
});
