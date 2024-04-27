import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

import { UserSchema } from '../user/userModel';

export const MeetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  link: z.string(),
  platform: z.string().optional(),
  members: z.array(UserSchema).optional().default([]),
  createdBy: UserSchema,
  updatedBy: UserSchema,
});

export type Meeting = z.infer<typeof MeetingSchema>;

export const GetMeetingSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
