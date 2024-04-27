import { StatusCodes } from 'http-status-codes';
import { vi } from 'vitest';

import { User } from '@/api/user/userModel';
import { UserRepository } from '@/api/user/userRepository';
import { UserService } from '@/api/user/userService';

vi.mock('@/api/user/userRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('userService', () => {
  const mockUsers: User[] = [
    { uid: '1', name: 'Alice', email: 'alice@example.com' },
    { uid: '2', name: 'Bob', email: 'bob@example.com' },
  ];

  describe('findAll', () => {
    it('return all users', async () => {
      // Arrange
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findAllAsync').mockReturnValue(Promise.resolve(mockUsers));
      const userService: UserService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Users found');
      expect(result.responseObject).toEqual(mockUsers);
    });

    it('returns a not found error for no users found', async () => {
      //Arrange
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findAllAsync').mockReturnValue(Promise.resolve([]));
      const userService: UserService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No users found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAll', async () => {
      // Arrange
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findAllAsync').mockRejectedValue(new Error('Database error'));
      const userService: UserService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding all users');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a user for a valid ID', async () => {
      // Arrange
      const testId = '1';
      const mockUser = mockUsers.find((user) => user.uid === testId) || null;
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findByIdAsync').mockReturnValue(Promise.resolve(mockUser));
      const userService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User found');
      expect(result.responseObject).toEqual(mockUser);
    });

    it('handles errors for findById', async () => {
      // Arrange
      const testId = '1';
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findByIdAsync').mockRejectedValue(new Error('Database error'));
      const userService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = '3';
      const mockUserRepository = new UserRepository();
      vi.spyOn(mockUserRepository, 'findByIdAsync').mockReturnValue(Promise.resolve(null));
      const userService = new UserService(mockUserRepository);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
});
