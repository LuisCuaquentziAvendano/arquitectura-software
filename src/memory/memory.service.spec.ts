/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryService } from './memory.service';
import { MemoryGame } from './memory-game';
import { getModelToken } from '@nestjs/mongoose';
import { Memory } from 'src/repositories/memory.repository';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/repositories/user.repository';

describe('MemoryService', () => {
  let service: MemoryService;
  let memoryGame: jest.Mocked<MemoryGame>;
  let memoryRepository: jest.Mocked<Model<Memory>>;

  const user: User = { _id: 'user123' } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoryService,
        {
          provide: MemoryGame,
          useValue: {
            startGame: jest.fn(),
            playTurn: jest.fn(),
          },
        },
        {
          provide: getModelToken(Memory.name),
          useValue: {
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<MemoryService>(MemoryService);
    memoryGame = module.get(MemoryGame);
    memoryRepository = module.get(getModelToken(Memory.name));
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should start a game and save it', async () => {
      const mockGame = {
        shownCards: [1, -1, -1],
        moves: 0,
        isEndOfGame: false,
      } as unknown as Memory;
      memoryGame.startGame.mockReturnValue(mockGame);
      (memoryRepository.findOneAndUpdate as jest.Mock).mockResolvedValue(
        mockGame,
      );
      const result = await service.startGame(user, 3);
      expect(memoryGame.startGame).toHaveBeenCalledWith(3);
      expect(memoryRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: user._id },
        mockGame,
        { upsert: true },
      );
      expect(result).toEqual({
        shownCards: mockGame.shownCards,
        moves: mockGame.moves,
        isEndOfGame: mockGame.isEndOfGame,
      });
    });
  });

  describe('playTurn', () => {
    it('should throw if no game in progress', async () => {
      (memoryRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.playTurn(user, 0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should play turn and update game', async () => {
      const mockGame = {
        userId: user._id,
        shownCards: [-1, -1],
        moves: 0,
        isEndOfGame: false,
      } as unknown as Memory;
      (memoryRepository.findOne as jest.Mock).mockResolvedValue(mockGame);
      memoryGame.playTurn.mockReturnValue(5);
      const result = await service.playTurn(user, 1);
      expect(memoryRepository.findOne).toHaveBeenCalledWith({
        userId: user._id,
      });
      expect(memoryGame.playTurn).toHaveBeenCalledWith(mockGame, 1);
      expect(memoryRepository.updateOne).toHaveBeenCalledWith(
        { userId: mockGame.userId },
        mockGame,
      );
      expect(result).toBe(5);
    });
  });

  describe('gameStatus', () => {
    it('should throw if no game in progress', async () => {
      (memoryRepository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.gameStatus(user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return current game state', async () => {
      const mockGame = {
        shownCards: [1, -1],
        moves: 2,
        isEndOfGame: true,
      } as unknown as Memory;
      (memoryRepository.findOne as jest.Mock).mockResolvedValue(mockGame);
      const result = await service.gameStatus(user);
      expect(memoryRepository.findOne).toHaveBeenCalledWith({
        userId: user._id,
      });
      expect(result).toEqual({
        shownCards: [1, -1],
        moves: 2,
        isEndOfGame: true,
      });
    });
  });
});
