/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { MemoryDto } from './dto/memory.dto';
import { UncoveredCardDto } from './dto/uncovered-card.dto';
import { User } from 'src/repositories/user.repository';
import { Request } from 'express';

describe('MemoryController', () => {
  let controller: MemoryController;
  let service: jest.Mocked<MemoryService>;

  const mockUser = { _id: 'user123' } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoryController],
      providers: [
        {
          provide: MemoryService,
          useValue: {
            startGame: jest.fn(),
            playTurn: jest.fn(),
            gameStatus: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<MemoryController>(MemoryController);
    service = module.get(MemoryService);
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should call service and return MemoryDto', async () => {
      const mockDto: MemoryDto = {
        shownCards: [1, -1, -1],
        moves: 0,
        isEndOfGame: false,
      };
      service.startGame.mockResolvedValue(mockDto);
      const req = { user: mockUser } as unknown as Request;
      const result = await controller.startGame({ pairs: 3 }, req);
      expect(service.startGame).toHaveBeenCalledWith(mockUser, 3);
      expect(result).toEqual(mockDto);
    });
  });

  describe('playTurn', () => {
    it('should call service and wrap result in UncoveredCardDto', async () => {
      service.playTurn.mockResolvedValue(7);
      const req = { user: mockUser } as unknown as Request;
      const result: UncoveredCardDto = await controller.playTurn(
        { position: 2 },
        req,
      );
      expect(service.playTurn).toHaveBeenCalledWith(mockUser, 2);
      expect(result).toEqual({ card: 7 });
    });
  });

  describe('gameStatus', () => {
    it('should return MemoryDto from service', async () => {
      const mockDto: MemoryDto = {
        shownCards: [1, 2, -1],
        moves: 5,
        isEndOfGame: true,
      };
      service.gameStatus.mockResolvedValue(mockDto);
      const req = { user: mockUser } as unknown as Request;
      const result = await controller.gameStatus(req);
      expect(service.gameStatus).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockDto);
    });
  });
});
