// import { PrismaPg } from '@prisma/adapter-pg';
// import 'dotenv/config';
// import { PrismaClient } from '../generated/prisma/client';

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// const prisma = new PrismaClient({ adapter });

// async function findAdminId(): Promise<string> {
//   const admin = await prisma.user.findFirst({
//     where: { role: 'ADMIN' },
//     select: { id: true, email: true },
//   });
//   if (!admin) {
//     throw new Error(
//       '❌ No ADMIN user found. Register via /api/v1/auth/register first, ' +
//         'then promote that user to ADMIN in the database (see README).'
//     );
//   }
//   console.log(`👤 Using admin author: ${admin.email}`);
//   return admin.id;
// }

// async function seedSkills() {
//   const skills = [
//     { name: 'TypeScript', category: 'Language', level: 90, order: 1 },
//     { name: 'JavaScript', category: 'Language', level: 90, order: 2 },
//     { name: 'React', category: 'Frontend', level: 90, order: 3 },
//     { name: 'Next.js', category: 'Frontend', level: 88, order: 4 },
//     { name: 'Tailwind CSS', category: 'Frontend', level: 90, order: 5 },
//     { name: 'Node.js', category: 'Backend', level: 88, order: 6 },
//     { name: 'Express.js', category: 'Backend', level: 88, order: 7 },
//     { name: 'PostgreSQL', category: 'Database', level: 82, order: 8 },
//     { name: 'Prisma', category: 'Database', level: 85, order: 9 },
//     { name: 'Git & GitHub', category: 'Tooling', level: 90, order: 10 },
//     { name: 'Docker', category: 'DevOps', level: 65, order: 11 },
//     { name: 'AI Integration (Gemini/Ollama)', category: 'AI', level: 75, order: 12 },
//   ];

//   for (const s of skills) {
//     await prisma.skill.upsert({
//       where: { name: s.name },
//       update: s,
//       create: s,
//     });
//   }
//   console.log(`✅ Skills seeded: ${skills.length}`);
// }

// async function seedServices() {
//   const services = [
//     {
//       slug: 'full-stack-web-app',
//       title: 'Full-Stack Web Application',
//       description:
//         'End-to-end web app development with Next.js, Express, PostgreSQL, and Prisma. Includes authentication, dashboards, and API design.',
//       features: [
//         'Next.js + TypeScript frontend',
//         'Express + Prisma backend',
//         'Secure authentication (JWT)',
//         'Admin dashboard & CRUD',
//       ],
//       icon: 'Code2',
//       order: 1,
//     },
//     {
//       slug: 'ai-integration',
//       title: 'AI Integration (Free-Tier Friendly)',
//       description:
//         'Add AI features — chat assistants, code explainers, content generators — using Gemini free tier or local Ollama, with graceful fallbacks.',
//       features: [
//         'Provider abstraction (Gemini/Ollama)',
//         'Rate limiting & caching',
//         'Grounded, source-based answers',
//         'Graceful quota-exhaustion UI',
//       ],
//       icon: 'Sparkles',
//       order: 2,
//     },
//     {
//       slug: 'rest-api-development',
//       title: 'REST API Development',
//       description:
//         'Clean, secure REST APIs with validation, authentication, and documentation. Built to scale from MVP to production.',
//       features: [
//         'Express + TypeScript',
//         'Zod validation',
//         'JWT auth + role-based access',
//         'Rate limiting + logging',
//       ],
//       icon: 'Server',
//       order: 3,
//     },
//   ];

//   for (const s of services) {
//     await prisma.service.upsert({
//       where: { slug: s.slug },
//       update: s,
//       create: s,
//     });
//   }
//   console.log(`✅ Services seeded: ${services.length}`);
// }

// async function seedProjects() {
//   const projects = [
//     {
//       slug: 'ai-portfolio-platform',
//       title: 'AI-Powered Portfolio Platform',
//       shortDesc:
//         'A full-stack developer portfolio with an AI assistant, admin dashboard, and free-tier-first architecture.',
//       description:
//         'A production-oriented portfolio platform that showcases projects, blog posts, and an AI assistant grounded in portfolio data. Designed to run entirely on free tiers with graceful degradation when AI quotas are exhausted.',
//       problem:
//         "Most developer portfolios are static brochures. They don't demonstrate backend skills, AI integration, or real engineering decisions.",
//       solution:
//         'Built a modular Express + Prisma backend, Next.js frontend, and an AI layer abstracted behind a provider interface (Gemini + Ollama fallback). Includes admin CRUD, contact workflow, and usage limits.',
//       architecture:
//         'Next.js App Router → Express API (modular MVC) → PostgreSQL (Neon) via Prisma. AI layer uses a provider abstraction with Gemini as primary and Ollama as local fallback. Rate limiting + caching on all AI routes.',
//       challenges:
//         'Keeping AI features optional when quotas run out; securely validating user-supplied repo URLs; designing a schema that supports both manual and AI-assisted content.',
//       lessonsLearned:
//         'Provider abstraction early on saves weeks; server-side validation is non-negotiable; graceful degradation beats retry storms.',
//       futureWork:
//         'pgvector-backed retrieval, multi-provider fallbacks, PDF resume parsing, public /api/me SDK.',
//       featured: true,
//       status: 'PUBLISHED' as const,
//       order: 1,
//       techs: ['Next.js', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Gemini API'],
//     },
//     {
//       slug: 'dev-task-manager',
//       title: 'Developer Task Manager',
//       shortDesc:
//         'A Kanban-style task manager with offline support and keyboard-first UX for developers.',
//       description:
//         'A minimal task manager tailored for solo developers: Markdown notes, labels, keyboard shortcuts, and local-first persistence with sync.',
//       problem:
//         'Most task apps are too heavy or too generic; developers want fast keyboard-driven workflows.',
//       solution:
//         'React + IndexedDB-first UI with background sync to a REST API; every action is keyboard-accessible.',
//       architecture:
//         'React + Zustand for state, IndexedDB (Dexie) for local storage, Express + PostgreSQL backend for sync, optimistic UI updates.',
//       challenges:
//         'Conflict resolution during offline sync; keeping bundle size small while supporting real-time updates.',
//       lessonsLearned:
//         'Offline-first is a product decision as much as a technical one; small bundles matter more than fancy animations.',
//       futureWork: 'Team workspaces, calendar view, GitHub issue import.',
//       featured: true,
//       status: 'PUBLISHED' as const,
//       order: 2,
//       techs: ['React', 'TypeScript', 'Zustand', 'Express', 'PostgreSQL'],
//     },
//     {
//       slug: 'content-curator-api',
//       title: 'Content Curator API',
//       shortDesc:
//         'A REST API that aggregates, validates, and stores curated dev content with full-text search.',
//       description:
//         'An API-first project for aggregating developer articles, validating them, and exposing them via full-text search and tag filters.',
//       problem:
//         'Developers need a clean, searchable feed of high-signal content without ads or noise.',
//       solution:
//         'Express + Prisma backend with PostgreSQL full-text search, cached aggregation jobs, and a public read-only API.',
//       architecture:
//         'Express API → PostgreSQL (with GIN index for FTS) → scheduled aggregation jobs → cached responses.',
//       challenges: 'Deduplicating content across sources; normalizing inconsistent metadata.',
//       lessonsLearned:
//         'PostgreSQL full-text search is more than enough for MVP; caching beats indexing for low-traffic endpoints.',
//       futureWork: 'Personalized feed, tag ontology, RSS export.',
//       featured: false,
//       status: 'PUBLISHED' as const,
//       order: 3,
//       techs: ['Express', 'TypeScript', 'Prisma', 'PostgreSQL'],
//     },
//   ];

//   for (const p of projects) {
//     const { techs, ...projectData } = p;
//     const project = await prisma.project.upsert({
//       where: { slug: projectData.slug },
//       update: {
//         ...projectData,
//         technologies: { deleteMany: {}, create: techs.map((name) => ({ name })) },
//       },
//       create: {
//         ...projectData,
//         technologies: { create: techs.map((name) => ({ name })) },
//       },
//     });
//     console.log(`  ✓ Project: ${project.slug}`);
//   }
//   console.log(`✅ Projects seeded: ${projects.length}`);
// }

// async function seedBlog(authorId: string) {
//   const post = {
//     slug: 'building-ai-features-on-free-tier',
//     title: 'Building AI Features on a Free Tier (Without Lying to Users)',
//     excerpt:
//       'How to add real AI features to a portfolio without paid APIs — and what to do when quotas run out.',
//     content:
//       '# Building AI Features on a Free Tier\n\nFree AI inference is not unlimited. In this post I outline the provider abstraction, rate limits, caching, and graceful degradation patterns I use in my portfolio.\n\n## The provider abstraction\n\nEvery AI call goes through a small interface...\n',
//     metaTitle: 'AI on a Free Tier — Provider Abstraction & Fallbacks',
//     metaDesc: 'Practical patterns for adding AI features to side projects without paid APIs.',
//     status: 'PUBLISHED' as const,
//     publishedAt: new Date(),
//     tags: ['AI', 'Free Tier', 'Architecture'],
//   };

//   const { tags, ...postData } = post;
//   const created = await prisma.blogPost.upsert({
//     where: { slug: post.slug },
//     update: {},
//     create: {
//       ...postData,
//       authorId,
//       tags: { create: tags.map((name) => ({ name })) },
//     },
//   });
//   console.log(`✅ Blog seeded: ${created.slug}`);
// }

// async function main() {
//   console.log('🌱 Seeding database...');
//   const adminId = await findAdminId();
//   await seedSkills();
//   await seedServices();
//   await seedProjects();
//   await seedBlog(adminId);
//   console.log('🎉 Seed complete');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e.message ?? e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function findAdminId(): Promise<string> {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true },
  });
  if (!admin) {
    throw new Error(
      '❌ No ADMIN user found. Register via /api/v1/auth/register first, ' +
        'then promote that user to ADMIN in the database (see README).'
    );
  }
  console.log(`👤 Using admin author: ${admin.email}`);
  return admin.id;
}

// ✅ নতুন: Profile তৈরি করার ফাংশন
async function seedProfile(userId: string) {
  await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      headline: 'Full-Stack Web Developer | AI-Driven Applications',
      shortBio:
        'I build fast, secure, and scalable web applications with Next.js, Express, PostgreSQL, and AI.',
      bio: 'I am a full-stack web developer focused on building production-ready applications. I work across the stack — from database design and secure APIs to polished, accessible UIs. I am especially interested in AI-integrated developer tools and free-tier-friendly architectures.',
      location: 'Bangladesh',
      email: 'admin@sohel.dev',
      githubUrl: 'https://github.com/',
      linkedinUrl: 'https://linkedin.com/',
      availableForWork: true,
    },
  });
  console.log('✅ Profile seeded');
}

async function seedSkills() {
  const skills = [
    { name: 'TypeScript', category: 'Language', level: 90, order: 1 },
    { name: 'JavaScript', category: 'Language', level: 90, order: 2 },
    { name: 'React', category: 'Frontend', level: 90, order: 3 },
    { name: 'Next.js', category: 'Frontend', level: 88, order: 4 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, order: 5 },
    { name: 'Node.js', category: 'Backend', level: 88, order: 6 },
    { name: 'Express.js', category: 'Backend', level: 88, order: 7 },
    { name: 'PostgreSQL', category: 'Database', level: 82, order: 8 },
    { name: 'Prisma', category: 'Database', level: 85, order: 9 },
    { name: 'Git & GitHub', category: 'Tooling', level: 90, order: 10 },
    { name: 'Docker', category: 'DevOps', level: 65, order: 11 },
    { name: 'AI Integration (Gemini/Ollama)', category: 'AI', level: 75, order: 12 },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Skills seeded: ${skills.length}`);
}

async function seedServices() {
  const services = [
    {
      slug: 'full-stack-web-app',
      title: 'Full-Stack Web Application',
      description:
        'End-to-end web app development with Next.js, Express, PostgreSQL, and Prisma. Includes authentication, dashboards, and API design.',
      features: [
        'Next.js + TypeScript frontend',
        'Express + Prisma backend',
        'Secure authentication (JWT)',
        'Admin dashboard & CRUD',
      ],
      icon: 'Code2',
      order: 1,
    },
    {
      slug: 'ai-integration',
      title: 'AI Integration (Free-Tier Friendly)',
      description:
        'Add AI features — chat assistants, code explainers, content generators — using Gemini free tier or local Ollama, with graceful fallbacks.',
      features: [
        'Provider abstraction (Gemini/Ollama)',
        'Rate limiting & caching',
        'Grounded, source-based answers',
        'Graceful quota-exhaustion UI',
      ],
      icon: 'Sparkles',
      order: 2,
    },
    {
      slug: 'rest-api-development',
      title: 'REST API Development',
      description:
        'Clean, secure REST APIs with validation, authentication, and documentation. Built to scale from MVP to production.',
      features: [
        'Express + TypeScript',
        'Zod validation',
        'JWT auth + role-based access',
        'Rate limiting + logging',
      ],
      icon: 'Server',
      order: 3,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Services seeded: ${services.length}`);
}

async function seedProjects() {
  const projects = [
    {
      slug: 'ai-portfolio-platform',
      title: 'AI-Powered Portfolio Platform',
      shortDesc:
        'A full-stack developer portfolio with an AI assistant, admin dashboard, and free-tier-first architecture.',
      description:
        'A production-oriented portfolio platform that showcases projects, blog posts, and an AI assistant grounded in portfolio data. Designed to run entirely on free tiers with graceful degradation when AI quotas are exhausted.',
      problem:
        "Most developer portfolios are static brochures. They don't demonstrate backend skills, AI integration, or real engineering decisions.",
      solution:
        'Built a modular Express + Prisma backend, Next.js frontend, and an AI layer abstracted behind a provider interface (Gemini + Ollama fallback). Includes admin CRUD, contact workflow, and usage limits.',
      architecture:
        'Next.js App Router → Express API (modular MVC) → PostgreSQL (Neon) via Prisma. AI layer uses a provider abstraction with Gemini as primary and Ollama as local fallback. Rate limiting + caching on all AI routes.',
      challenges:
        'Keeping AI features optional when quotas run out; securely validating user-supplied repo URLs; designing a schema that supports both manual and AI-assisted content.',
      lessonsLearned:
        'Provider abstraction early on saves weeks; server-side validation is non-negotiable; graceful degradation beats retry storms.',
      futureWork:
        'pgvector-backed retrieval, multi-provider fallbacks, PDF resume parsing, public /api/me SDK.',
      featured: true,
      status: 'PUBLISHED' as const,
      order: 1,
      techs: ['Next.js', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Gemini API'],
    },
    {
      slug: 'dev-task-manager',
      title: 'Developer Task Manager',
      shortDesc:
        'A Kanban-style task manager with offline support and keyboard-first UX for developers.',
      description:
        'A minimal task manager tailored for solo developers: Markdown notes, labels, keyboard shortcuts, and local-first persistence with sync.',
      problem:
        'Most task apps are too heavy or too generic; developers want fast keyboard-driven workflows.',
      solution:
        'React + IndexedDB-first UI with background sync to a REST API; every action is keyboard-accessible.',
      architecture:
        'React + Zustand for state, IndexedDB (Dexie) for local storage, Express + PostgreSQL backend for sync, optimistic UI updates.',
      challenges:
        'Conflict resolution during offline sync; keeping bundle size small while supporting real-time updates.',
      lessonsLearned:
        'Offline-first is a product decision as much as a technical one; small bundles matter more than fancy animations.',
      futureWork: 'Team workspaces, calendar view, GitHub issue import.',
      featured: true,
      status: 'PUBLISHED' as const,
      order: 2,
      techs: ['React', 'TypeScript', 'Zustand', 'Express', 'PostgreSQL'],
    },
    {
      slug: 'content-curator-api',
      title: 'Content Curator API',
      shortDesc:
        'A REST API that aggregates, validates, and stores curated dev content with full-text search.',
      description:
        'An API-first project for aggregating developer articles, validating them, and exposing them via full-text search and tag filters.',
      problem:
        'Developers need a clean, searchable feed of high-signal content without ads or noise.',
      solution:
        'Express + Prisma backend with PostgreSQL full-text search, cached aggregation jobs, and a public read-only API.',
      architecture:
        'Express API → PostgreSQL (with GIN index for FTS) → scheduled aggregation jobs → cached responses.',
      challenges: 'Deduplicating content across sources; normalizing inconsistent metadata.',
      lessonsLearned:
        'PostgreSQL full-text search is more than enough for MVP; caching beats indexing for low-traffic endpoints.',
      futureWork: 'Personalized feed, tag ontology, RSS export.',
      featured: false,
      status: 'PUBLISHED' as const,
      order: 3,
      techs: ['Express', 'TypeScript', 'Prisma', 'PostgreSQL'],
    },
  ];

  for (const p of projects) {
    const { techs, ...projectData } = p;
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {
        ...projectData,
        technologies: { deleteMany: {}, create: techs.map((name) => ({ name })) },
      },
      create: {
        ...projectData,
        technologies: { create: techs.map((name) => ({ name })) },
      },
    });
    console.log(`  ✓ Project: ${project.slug}`);
  }
  console.log(`✅ Projects seeded: ${projects.length}`);
}

async function seedBlog(authorId: string) {
  const post = {
    slug: 'building-ai-features-on-free-tier',
    title: 'Building AI Features on a Free Tier (Without Lying to Users)',
    excerpt:
      'How to add real AI features to a portfolio without paid APIs — and what to do when quotas run out.',
    content:
      '# Building AI Features on a Free Tier\n\nFree AI inference is not unlimited. In this post I outline the provider abstraction, rate limits, caching, and graceful degradation patterns I use in my portfolio.\n\n## The provider abstraction\n\nEvery AI call goes through a small interface...\n',
    metaTitle: 'AI on a Free Tier — Provider Abstraction & Fallbacks',
    metaDesc: 'Practical patterns for adding AI features to side projects without paid APIs.',
    status: 'PUBLISHED' as const,
    publishedAt: new Date(),
    tags: ['AI', 'Free Tier', 'Architecture'],
  };

  const { tags, ...postData } = post;
  const created = await prisma.blogPost.upsert({
    where: { slug: post.slug },
    update: {},
    create: {
      ...postData,
      authorId,
      tags: { create: tags.map((name) => ({ name })) },
    },
  });
  console.log(`✅ Blog seeded: ${created.slug}`);
}

async function main() {
  console.log('🌱 Seeding database...');
  const adminId = await findAdminId();
  await seedProfile(adminId); // ✅ নতুন লাইন
  await seedSkills();
  await seedServices();
  await seedProjects();
  await seedBlog(adminId);
  console.log('🎉 Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message ?? e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
