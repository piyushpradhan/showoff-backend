import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { User } from '@/api/user/userModel';
import { UserRepository } from '@/api/user/userRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';

describe('User API Endpoints', () => {
  describe('GET /users', () => {
    it('should return a list of users', async () => {
      // Act
      const response = await request(app).get('/users');
      const responseBody: ServiceResponse<User[]> = response.body;
      const userRepository: UserRepository = new UserRepository();
      const users = await userRepository.findAllAsync();

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Users found');
      expect(responseBody.responseObject.length).toEqual(users.length);
      responseBody.responseObject.forEach((user, index) => compareUsers(users[index] as User, user));
    });
  });

  describe('GET /users/:id', () => {
    const mockUsers: User[] = [
      { uid: '1', name: 'Alice', email: 'alice@example.com' },
      { uid: '2', name: 'Bob', email: 'bob@example.com' },
    ];

    it('should return a user for a valid ID', async () => {
      // Arrange
      const testId = '1';
      const expectedUser = mockUsers.find((user) => user.uid === testId) as User;

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody: ServiceResponse<User> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User found');
      if (!expectedUser) throw new Error('Invalid test data: expectedUser is undefined');
      compareUsers(expectedUser, responseBody.responseObject);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const testId = `${Number.MAX_SAFE_INTEGER}`;

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('User not found');
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareUsers(mockUser: User, responseUser: User) {
  if (!mockUser || !responseUser) {
    throw new Error('Invalid test data: mockUser or responseUser is undefined');
  }

  expect(responseUser.uid).toEqual(mockUser.uid);
  expect(responseUser.name).toEqual(mockUser.name);
  expect(responseUser.email).toEqual(mockUser.email);
}
