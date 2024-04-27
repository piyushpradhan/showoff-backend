import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { UserRepository } from '../user/userRepository';
import { UserService } from '../user/userService';
import { MeetingSchema } from './meetingModel';

export const meetingRegistry = new OpenAPIRegistry();

export const meetingRouter: Router = (() => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const router = express.Router();

  meetingRegistry.registerPath({
    method: 'get',
    path: '/meetings',
    tags: ['Meeting'],
    responses: createApiResponse(z.array(MeetingSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
