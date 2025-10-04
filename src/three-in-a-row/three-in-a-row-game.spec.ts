import { BadRequestException } from '@nestjs/common';
import { ThreeInARowGame } from './three-in-a-row-game';
import { Box, ThreeInARowDto } from './dto/three-in-a-row.dto';

jest.mock('../utils/random', () => ({
  selectRandomFromArray: jest.fn(),
}));

import { selectRandomFromArray } from '../utils/random';

describe('ThreeInARowGame', () => {
  let gameService: ThreeInARowGame;

  beforeEach(() => {
    gameService = new ThreeInARowGame();
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should initialize an empty board and let USER start', () => {
      (selectRandomFromArray as jest.Mock).mockReturnValue(Box.USER);
      const game: ThreeInARowDto = gameService.startGame();
      expect(game.board.flat()).toEqual([
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
        Box.EMPTY,
      ]);
      expect(game.isEndOfGame).toBe(false);
      expect(game.winningBoxes).toEqual([]);
    });

    it('should make a server move if SERVER starts', () => {
      (selectRandomFromArray as jest.Mock).mockReturnValueOnce(Box.SERVER);
      (selectRandomFromArray as jest.Mock).mockReturnValueOnce([0, 0]);
      const game = gameService.startGame();
      expect(game.board[0][0]).toBe(Box.SERVER);
    });
  });

  describe('playUserTurn', () => {
    let game: ThreeInARowDto;

    beforeEach(() => {
      (selectRandomFromArray as jest.Mock).mockReturnValue(Box.USER);
      game = gameService.startGame();
    });

    it('should place user mark and then server mark', () => {
      (selectRandomFromArray as jest.Mock).mockReturnValue([0, 1]);
      gameService.playUserTurn(game, 0, 0);
      expect(game.board[0][0]).toBe(Box.USER);
      expect(game.board[0][1]).toBe(Box.SERVER);
    });

    it('should throw if move is outside empty position', () => {
      game.board[0][0] = Box.USER;
      expect(() => gameService.playUserTurn(game, 0, 0)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if game already ended', () => {
      game.isEndOfGame = true;
      expect(() => gameService.playUserTurn(game, 0, 0)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('end-of-game conditions', () => {
    let game: ThreeInARowDto;

    beforeEach(() => {
      (selectRandomFromArray as jest.Mock).mockReturnValue(Box.USER);
      game = gameService.startGame();
    });

    it('should detect user win', () => {
      game.board = [
        [Box.USER, Box.USER, Box.USER],
        [Box.EMPTY, Box.EMPTY, Box.EMPTY],
        [Box.EMPTY, Box.EMPTY, Box.EMPTY],
      ];
      gameService.playUserTurn(game, 1, 1);
      expect(game.isEndOfGame).toBe(true);
      expect(game.winningBoxes).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    });

    it('should detect server win', () => {
      game.board = [
        [Box.SERVER, Box.EMPTY, Box.EMPTY],
        [Box.SERVER, Box.EMPTY, Box.EMPTY],
        [Box.SERVER, Box.EMPTY, Box.EMPTY],
      ];
      gameService.playUserTurn(game, 1, 1);
      expect(game.isEndOfGame).toBe(true);
      expect(game.winningBoxes).toEqual([
        [0, 0],
        [1, 0],
        [2, 0],
      ]);
    });

    it('should throw if trying to play on a full (drawn) board', () => {
      game.board = [
        [Box.USER, Box.SERVER, Box.USER],
        [Box.USER, Box.SERVER, Box.SERVER],
        [Box.SERVER, Box.USER, Box.USER],
      ];
      expect(() => gameService.playUserTurn(game, 0, 0)).toThrow(
        BadRequestException,
      );
    });
  });
});
