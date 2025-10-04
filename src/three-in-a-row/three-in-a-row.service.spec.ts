import { Test, TestingModule } from '@nestjs/testing';
import { ThreeInARowService } from './three-in-a-row.service';
import { ThreeInARowGame } from './three-in-a-row-game';
import { getModelToken } from '@nestjs/mongoose';
import { ThreeInARow } from 'src/repositories/three-in-a-row.repository';
import { User } from 'src/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { Box, ThreeInARowDto } from './dto/three-in-a-row.dto';

describe('ThreeInARowService', () => {
  let service: ThreeInARowService;
  const gameMock = {
    startGame: jest.fn(),
    playUserTurn: jest.fn(),
  };
  const repoMock = {
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockUser = { _id: 'user123' } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreeInARowService,
        { provide: ThreeInARowGame, useValue: gameMock },
        { provide: getModelToken(ThreeInARow.name), useValue: repoMock },
      ],
    }).compile();
    service = module.get<ThreeInARowService>(ThreeInARowService);
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should create a new game and save it', async () => {
      const mockDto: ThreeInARowDto = {
        board: [
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
        ],
        isEndOfGame: false,
        winningBoxes: [],
      };
      gameMock.startGame.mockReturnValue(mockDto);
      repoMock.findOneAndUpdate.mockResolvedValue(null);
      const result = await service.startGame(mockUser);
      expect(gameMock.startGame).toHaveBeenCalled();
      expect(repoMock.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: mockUser._id },
        mockDto,
        { upsert: true },
      );
      expect(result).toEqual(mockDto);
    });
  });

  describe('playUserTurn', () => {
    it('should throw if no game exists', async () => {
      repoMock.findOne.mockResolvedValue(null);
      await expect(service.playUserTurn(mockUser, 0, 0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update the game and return dto', async () => {
      const storedGame = {
        userId: mockUser._id,
        board: [
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
        ],
        isEndOfGame: false,
        winningBoxes: [],
      };
      repoMock.findOne.mockResolvedValue(storedGame);
      repoMock.updateOne.mockResolvedValue({});
      gameMock.playUserTurn.mockImplementation(
        (game: ThreeInARow, i: number, j: number) => {
          game.board[i][j] = Box.USER;
        },
      );
      const result = await service.playUserTurn(mockUser, 0, 1);
      expect(repoMock.findOne).toHaveBeenCalledWith({ userId: mockUser._id });
      expect(gameMock.playUserTurn).toHaveBeenCalledWith(storedGame, 0, 1);
      expect(repoMock.updateOne).toHaveBeenCalledWith(
        { userId: mockUser._id },
        storedGame,
      );
      expect(result).toEqual({
        board: storedGame.board,
        isEndOfGame: false,
        winningBoxes: [],
      });
    });
  });
});
