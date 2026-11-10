import { Request, Response } from 'express';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { skillService } from './skill.service';

export const skillController = {
  listPublic: asyncHandler(async (req: Request, res: Response) => {
    const result = await skillService.list(req.query as any);
    return sendResponse(res, {
      message: 'Skills fetched',
      data: result.items,
      meta: { total: result.total },
    });
  }),

  getByIdAdmin: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const skill = await skillService.getById(id);
    return sendResponse(res, { message: 'Skill fetched', data: skill });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const skill = await skillService.create(req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Skill created',
      data: skill,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const skill = await skillService.update(id, req.body);
    return sendResponse(res, { message: 'Skill updated', data: skill });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await skillService.remove(id);
    return sendResponse(res, { message: 'Skill deleted' });
  }),
};
