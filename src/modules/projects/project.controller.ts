import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { projectService } from './project.service';

export const projectController = {
  listPublic: asyncHandler(async (req: Request, res: Response) => {
    const result = await projectService.list(req.query as any, false);
    return sendResponse(res, {
      message: 'Projects fetched',
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }),

  getBySlugPublic: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string; // ✅ cast
    const project = await projectService.getBySlug(slug, false);
    void projectService.incrementViews(slug);
    return sendResponse(res, { message: 'Project fetched', data: project });
  }),

  listAdmin: asyncHandler(async (req: Request, res: Response) => {
    const result = await projectService.list(req.query as any, true);
    return sendResponse(res, {
      message: 'Projects fetched',
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }),

  getByIdAdmin: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // ✅ cast
    // slug বা id — দুটোই support করি
    let project = null;
    try {
      project = await projectService.getBySlug(id, true);
    } catch {
      project = await prisma.project.findUnique({
        where: { id },
        include: { technologies: true },
      });
    }
    if (!project) throw new AppError('Project not found', 404);
    return sendResponse(res, { message: 'Project fetched', data: project });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Project created',
      data: project,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // ✅ cast
    const project = await projectService.update(id, req.body);
    return sendResponse(res, { message: 'Project updated', data: project });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // ✅ cast
    await projectService.remove(id);
    return sendResponse(res, { statusCode: 200, message: 'Project deleted' });
  }),

  toggleFeatured: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // ✅ cast
    const project = await projectService.toggleFeatured(id);
    return sendResponse(res, { message: 'Featured toggled', data: project });
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string; // ✅ cast
    const { status } = req.body as { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' };
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new AppError('Invalid status', 422);
    }
    const project = await projectService.setStatus(id, status);
    return sendResponse(res, { message: 'Status updated', data: project });
  }),
};
