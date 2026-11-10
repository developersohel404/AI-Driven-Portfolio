import { z } from 'zod';

export const updateProfileSchema = z.object({
  headline: z.string().min(5).max(160).trim().nullish(),
  shortBio: z.string().min(10).max(300).trim().nullish(),
  bio: z.string().min(20).trim().nullish(),
  location: z.string().max(80).trim().nullish(),
  email: z.string().email().nullish(),
  phone: z.string().max(30).trim().nullish(),
  avatarUrl: z.string().url().nullish(),
  resumeUrl: z.string().url().nullish(),
  githubUrl: z.string().url().nullish(),
  linkedinUrl: z.string().url().nullish(),
  twitterUrl: z.string().url().nullish(),
  websiteUrl: z.string().url().nullish(),
  availableForWork: z.boolean().nullish(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
