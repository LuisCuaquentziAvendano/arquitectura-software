/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ThreeInARowController } from './three-in-a-row.controller';
import { ThreeInARowService } from './three-in-a-row.service';
import type { ThreeInARowDto } from './dto/three-in-a-row.dto';
import { User } from 'src/repositories/user.repository';
import { Box } from './dto/three-in-a-row.dto';
import { Request } from 'express';

describe('ThreeInARowController', () => {
  let controller: ThreeInARowController;
  let service: jest.Mocked<ThreeInARowService>;

  const mockUser = { _id: 'user123' } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreeInARowController],
      providers: [
        {
          provide: ThreeInARowService,
          useValue: {
            startGame: jest.fn(),
            playUserTurn: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<ThreeInARowController>(ThreeInARowController);
    service = module.get(ThreeInARowService);
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should call service and return game dto', async () => {
      const mockDto: ThreeInARowDto = {
        board: [
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
        ],
        isEndOfGame: false,
        winningBoxes: [],
      };
      service.startGame.mockResolvedValue(mockDto);
      const req = { user: mockUser } as unknown as Request;
      const result = await controller.startGame(req);
      expect(service.startGame).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockDto);
    });
  });

  describe('playUserTurn', () => {
    it('should call service with row/col and return updated dto', async () => {
      const mockDto: ThreeInARowDto = {
        board: [
          [Box.USER, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
          [Box.EMPTY, Box.EMPTY, Box.EMPTY],
        ],
        isEndOfGame: false,
        winningBoxes: [],
      };
      service.playUserTurn.mockResolvedValue(mockDto);
      const req = { user: mockUser } as unknown as Request;
      const result = await controller.playUserTurn({ row: 0, col: 0 }, req);
      expect(service.playUserTurn).toHaveBeenCalledWith(mockUser, 0, 0);
      expect(result).toEqual(mockDto);
    });
  });
});
