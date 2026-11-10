import { Request, Response } from 'express';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { serviceService } from './service.service';

export const serviceController = {
  listPublic: asyncHandler(async (req: Request, res: Response) => {
    const result = await serviceService.list(req.query as any, false);
    return sendResponse(res, {
      message: 'Services fetched',
      data: result.items,
      meta: { total: result.total },
    });
  }),

  getBySlugPublic: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const service = await serviceService.getBySlug(slug, false);
    return sendResponse(res, { message: 'Service fetched', data: service });
  }),

  listAdmin: asyncHandler(async (req: Request, res: Response) => {
    const result = await serviceService.list(req.query as any, true);
    return sendResponse(res, {
      message: 'Services fetched',
      data: result.items,
      meta: { total: result.total },
    });
  }),

  getByIdAdmin: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const service = await serviceService.getById(id);
    return sendResponse(res, { message: 'Service fetched', data: service });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceService.create(req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Service created',
      data: service,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const service = await serviceService.update(id, req.body);
    return sendResponse(res, { message: 'Service updated', data: service });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await serviceService.remove(id);
    return sendResponse(res, { message: 'Service deleted' });
  }),

  togglePublished: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const service = await serviceService.togglePublished(id);
    return sendResponse(res, { message: 'Published toggled', data: service });
  }),
};
