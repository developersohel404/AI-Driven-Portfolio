import { aiService } from '../../lib/ai/ai-service';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { buildCaseStudyMessages, parseCaseStudyJson } from './case-study.prompt';
import type { CaseStudyGenerateResult } from './case-study.type';
import type { GenerateCaseStudyInput, SaveCaseStudyInput } from './case-study.validation';

export const caseStudyService = {
  /** AI দিয়ে structured draft তৈরি */
  async generate(input: GenerateCaseStudyInput): Promise<CaseStudyGenerateResult> {
    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
      select: { id: true, title: true, shortDesc: true },
    });
    if (!project) throw new AppError('Project not found', 404);

    if (input.source === 'manual' && !input.description && !input.problem && !input.readme) {
      throw new AppError('Provide at least a readme, description, or problem statement.', 422);
    }

    const messages = buildCaseStudyMessages(input);
    const result = await aiService.generate('CASE_STUDY', messages, {
      maxOutputTokens: 1200,
      temperature: 0.4,
    });

    const draft = parseCaseStudyJson(result.text);

    // saveAsDraft true হলে DB-তে draft আকারে সেভ
    if (input.saveAsDraft) {
      await this.save(input.projectId, {
        ...draft,
        publish: false,
      });
    }

    return {
      draft,
      provider: result.provider,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      sourceKind: input.source,
      saved: input.saveAsDraft,
      projectId: project.id,
    };
  },

  /** manual save (AI ছাড়াও কাজ করে) */
  async save(projectId: string, input: Omit<SaveCaseStudyInput, 'projectId'>) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) throw new AppError('Project not found', 404);

    // শুধু যেসব ফিল্ড পাঠানো হয়েছে, সেগুলো update
    const data: Record<string, string | undefined> = {
      problem: input.problem,
      solution: input.solution,
      architecture: input.architecture,
      challenges: input.challenges,
      lessonsLearned: input.lessonsLearned,
      futureWork: input.futureWork,
    };
    // goals/decisions থাকে না Project schema-তে, সেগুলো problem/architecture-এ যোগ করি
    if (input.goals) {
      data.problem = [data.problem, `Goals: ${input.goals}`].filter(Boolean).join('\n\n');
    }
    if (input.decisions) {
      data.architecture = [data.architecture, `Key decisions: ${input.decisions}`]
        .filter(Boolean)
        .join('\n\n');
    }

    const updateData: Record<string, unknown> = { ...data };
    if (input.publish) updateData.status = 'PUBLISHED';

    // undefined বাদ দিই
    for (const k of Object.keys(updateData)) {
      if (updateData[k] === undefined) delete updateData[k];
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        problem: true,
        solution: true,
        architecture: true,
        challenges: true,
        lessonsLearned: true,
        futureWork: true,
      },
    });

    return updated;
  },

  /** admin-এর project list (case-study লেখার জন্য) */
  async listProjectsForCaseStudy() {
    return prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        problem: true,
        solution: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  /** একটা project-এর বর্তমান case study content */
  async getByProjectId(projectId: string) {
    const p = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        problem: true,
        solution: true,
        architecture: true,
        challenges: true,
        lessonsLearned: true,
        futureWork: true,
      },
    });
    if (!p) throw new AppError('Project not found', 404);
    return p;
  },
};
