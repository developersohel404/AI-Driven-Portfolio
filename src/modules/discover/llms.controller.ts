import { Request, Response } from 'express';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../utils/async-handler';

export const llmsController = {
  /** GET /llms.txt — plain text index */
  index: asyncHandler(async (_req: Request, res: Response) => {
    const [profile, projects, services, skills, blogs] = await Promise.all([
      prisma.profile.findFirst({
        select: {
          headline: true,
          shortBio: true,
          location: true,
          email: true,
          githubUrl: true,
          linkedinUrl: true,
          websiteUrl: true,
          user: { select: { name: true } },
        },
      }),
      prisma.project.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          title: true,
          slug: true,
          shortDesc: true,
          liveUrl: true,
          repoUrl: true,
          technologies: { select: { name: true } },
        },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.service.findMany({
        where: { published: true },
        select: { title: true, slug: true, description: true },
        orderBy: { order: 'asc' },
      }),
      prisma.skill.findMany({
        select: { name: true, category: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { title: true, slug: true, excerpt: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }),
    ]);

    const baseUrl = env.FRONTEND_URL;
    const lines: string[] = [];

    lines.push('# Sohel.dev — Portfolio Index');
    lines.push('');

    if (profile) {
      lines.push(`Name: ${profile.user.name}`);
      lines.push(`Title: ${profile.headline}`);
      lines.push(`Bio: ${profile.shortBio}`);
      if (profile.location) lines.push(`Location: ${profile.location}`);
      if (profile.email) lines.push(`Email: ${profile.email}`);
      lines.push('');
    }

    lines.push('## Pages');
    lines.push(`Home: ${baseUrl}/`);
    lines.push(`About: ${baseUrl}/about`);
    lines.push(`Services: ${baseUrl}/services`);
    lines.push(`Skills: ${baseUrl}/skills`);
    lines.push(`Projects: ${baseUrl}/projects`);
    lines.push(`Blog: ${baseUrl}/blog`);
    lines.push(`Contact: ${baseUrl}/contact`);
    lines.push(`AI Assistant: ${baseUrl}/ai-assistant`);
    lines.push(`AI Tools: ${baseUrl}/ai-tools`);
    lines.push(`Public JSON Profile: ${baseUrl}/api/v1/me`);
    lines.push('');

    if (services.length) {
      lines.push('## Services');
      for (const s of services) {
        lines.push(`- ${s.title} (${baseUrl}/services#${s.slug}): ${s.description}`);
      }
      lines.push('');
    }

    if (projects.length) {
      lines.push('## Projects');
      for (const p of projects) {
        lines.push(`### ${p.title}`);
        lines.push(`URL: ${baseUrl}/projects/${p.slug}`);
        lines.push(`Description: ${p.shortDesc}`);
        lines.push(`Tech: ${p.technologies.map((t) => t.name).join(', ')}`);
        if (p.liveUrl) lines.push(`Live: ${p.liveUrl}`);
        if (p.repoUrl) lines.push(`Repo: ${p.repoUrl}`);
        lines.push('');
      }
    }

    if (skills.length) {
      lines.push('## Skills');
      const byCategory: Record<string, string[]> = {};
      for (const s of skills) (byCategory[s.category] ??= []).push(s.name);
      for (const [cat, names] of Object.entries(byCategory)) {
        lines.push(`- ${cat}: ${names.join(', ')}`);
      }
      lines.push('');
    }

    if (blogs.length) {
      lines.push('## Latest Blog Posts');
      for (const b of blogs) {
        lines.push(`- ${b.title} — ${baseUrl}/blog/${b.slug}`);
        lines.push(`  ${b.excerpt}`);
      }
      lines.push('');
    }

    lines.push('## Links');
    if (profile?.githubUrl) lines.push(`- GitHub: ${profile.githubUrl}`);
    if (profile?.linkedinUrl) lines.push(`- LinkedIn: ${profile.linkedinUrl}`);
    if (profile?.websiteUrl) lines.push(`- Website: ${profile.websiteUrl}`);

    res.type('text/plain; charset=utf-8').send(lines.join('\n'));
  }),
};
