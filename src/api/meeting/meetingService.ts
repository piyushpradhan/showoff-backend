import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { Meeting } from './meetingModel';
import { MeetingRepository } from './meetingRepository';

export class MeetingService {
  private meetingRepository: MeetingRepository;

  constructor() {
    this.meetingRepository = new MeetingRepository();
  }

  async findUserMeetings(): Promise<ServiceResponse<Meeting[]>> {
    try {
      const meetings = await this.meetingRepository.findUserMeetings();
      if (!meetings) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "You don't have any meetings scheduled",
          [],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return new ServiceResponse(ResponseStatus.Success, 'Meetings scheduled with you', meetings, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding users' meetings ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
