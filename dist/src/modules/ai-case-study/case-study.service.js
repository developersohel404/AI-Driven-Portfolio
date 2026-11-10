"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseStudyService = void 0;
const ai_service_1 = require("../../lib/ai/ai-service");
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const case_study_prompt_1 = require("./case-study.prompt");
exports.caseStudyService = {
    /** AI দিয়ে structured draft তৈরি */
    async generate(input) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: input.projectId },
            select: { id: true, title: true, shortDesc: true },
        });
        if (!project)
            throw new error_handler_1.AppError('Project not found', 404);
        if (input.source === 'manual' && !input.description && !input.problem && !input.readme) {
            throw new error_handler_1.AppError('Provide at least a readme, description, or problem statement.', 422);
        }
        const messages = (0, case_study_prompt_1.buildCaseStudyMessages)(input);
        const result = await ai_service_1.aiService.generate('CASE_STUDY', messages, {
            maxOutputTokens: 1200,
            temperature: 0.4,
        });
        const draft = (0, case_study_prompt_1.parseCaseStudyJson)(result.text);
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
    async save(projectId, input) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true },
        });
        if (!project)
            throw new error_handler_1.AppError('Project not found', 404);
        // শুধু যেসব ফিল্ড পাঠানো হয়েছে, সেগুলো update
        const data = {
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
        const updateData = { ...data };
        if (input.publish)
            updateData.status = 'PUBLISHED';
        // undefined বাদ দিই
        for (const k of Object.keys(updateData)) {
            if (updateData[k] === undefined)
                delete updateData[k];
        }
        const updated = await prisma_1.prisma.project.update({
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
        return prisma_1.prisma.project.findMany({
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
    async getByProjectId(projectId) {
        const p = await prisma_1.prisma.project.findUnique({
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
        if (!p)
            throw new error_handler_1.AppError('Project not found', 404);
        return p;
    },
};
