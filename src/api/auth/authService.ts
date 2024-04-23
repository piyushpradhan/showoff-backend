import { StatusCodes } from 'http-status-codes';

import { User } from '@/api/user/userModel';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { AuthRepository } from './authRepository';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async loginWithGoogle(uid: string, name: string, email: string): Promise<ServiceResponse<User | null>> {
    try {
      const userDetails = await this.authRepository.createOrUpdateUser(uid, name, email);
      if (!userDetails) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Unable to login. Please try again later',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return new ServiceResponse(ResponseStatus.Success, 'Logged in successfully', userDetails, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error logging in user: ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Something went wrong',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
