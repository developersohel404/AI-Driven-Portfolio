import { Request, Response } from 'express';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { contactService } from './contact.service';

export const contactController = {
  submit: asyncHandler(async (req: Request, res: Response) => {
    const result = await contactService.submit(req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Message received. Thank you!',
      data: result,
    });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await contactService.list(req.query as any);
    return sendResponse(res, {
      message: 'Contact messages fetched',
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const message = await contactService.getById(id);
    return sendResponse(res, { message: 'Contact message fetched', data: message });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const message = await contactService.updateStatus(id, status);
    return sendResponse(res, { message: 'Status updated', data: message });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await contactService.remove(id);
    return sendResponse(res, { message: 'Contact message deleted' });
  }),

  stats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await contactService.stats();
    return sendResponse(res, { message: 'Contact stats', data: stats });
  }),
};
