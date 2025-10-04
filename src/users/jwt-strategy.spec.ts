/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { JwtStrategy } from './jwt-strategy';
import { User } from 'src/repositories/user.repository';
import { Model } from 'mongoose';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
  } as unknown as ConfigService;
  const mockUserRepository = {
    findOne: jest.fn(),
  } as unknown as Model<User>;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy(mockConfigService, mockUserRepository);
  });

  describe('validate', () => {
    it('should return a user if found', async () => {
      const payload = { userId: '123' };
      const mockUser = {
        _id: '123',
        name: 'Test',
        email: 'test@mail.com',
      } as unknown as User;
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await jwtStrategy.validate(payload);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        _id: payload.userId,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const payload = { userId: '123' };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('constructor', () => {
    it('should call configService.getOrThrow with JWT_SECRET', () => {
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
