/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/repositories/user.repository';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: jest.Mocked<JwtService>;
  const userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: userRepository,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw if email already registered', async () => {
      userRepository.findOne.mockResolvedValue({
        id: '123',
        email: 'test@mail.com',
      });
      const dto: SignupDto = {
        name: 'User',
        email: 'test@mail.com',
        password: 'pass',
      };
      await expect(service.signup(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create a new user with hashed password', async () => {
      userRepository.findOne.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashedPass');
      const createdUser = { _id: '1', name: 'User', email: 'mail@mail.com' };
      userRepository.create.mockResolvedValue(createdUser);
      const dto: SignupDto = {
        name: 'User',
        email: 'mail@mail.com',
        password: 'pass',
      };
      const result = await service.signup(dto);
      expect(hash).toHaveBeenCalledWith(dto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        password: 'hashedPass',
      });
      expect(result).toEqual({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      });
    });
  });

  describe('login', () => {
    it('should throw if email not registered', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const dto: LoginDto = { email: 'notfound@mail.com', password: 'pass' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      const user = { id: '123', email: 'mail@mail.com', password: 'hashed' };
      userRepository.findOne.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);
      const dto: LoginDto = { email: 'mail@mail.com', password: 'wrong' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return a signed JWT if credentials are valid', async () => {
      const user = { id: '123', email: 'mail@mail.com', password: 'hashed' };
      userRepository.findOne.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('signed-jwt');
      const dto: LoginDto = { email: 'mail@mail.com', password: 'pass' };
      const result = await service.login(dto);
      expect(compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: user.id });
      expect(result).toEqual({ authorization: 'signed-jwt' });
    });
  });
});
