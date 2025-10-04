import { BadRequestException } from '@nestjs/common';
import { MemoryGame } from './memory-game';
import { Memory } from 'src/repositories/memory.repository';

describe('MemoryGame', () => {
  let memoryGame: MemoryGame;

  beforeEach(() => {
    memoryGame = new MemoryGame();
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should create a game with shuffled and hidden cards', () => {
      const pairs = 3;
      const game: Memory = memoryGame.startGame(pairs);
      expect(game.shuffledCards).toHaveLength(pairs * 2);
      expect(game.shownCards).toHaveLength(pairs * 2);
      expect(game.shownCards.every((c) => c === -1)).toBe(true);
      expect(game.moves).toBe(0);
      expect(game.runningMove).toBe(-1);
      expect(game.isEndOfGame).toBe(false);
    });
  });

  describe('playTurn', () => {
    let game: Memory;

    beforeEach(() => {
      game = memoryGame.startGame(2);
      game.shuffledCards = [1, 1, 2, 2];
      game.shownCards = [-1, -1, -1, -1];
    });

    it('should reveal the first card and not increment moves', () => {
      const card = memoryGame.playTurn(game, 0);
      expect(card).toBe(1);
      expect(game.shownCards[0]).toBe(1);
      expect(game.moves).toBe(0);
      expect(game.runningMove).toBe(0);
    });

    it('should reveal a matching second card and increment moves', () => {
      memoryGame.playTurn(game, 0);
      const card = memoryGame.playTurn(game, 1);
      expect(card).toBe(1);
      expect(game.shownCards[0]).toBe(1);
      expect(game.shownCards[1]).toBe(1);
      expect(game.moves).toBe(1);
      expect(game.runningMove).toBe(-1);
    });

    it('should hide first card if second does not match', () => {
      memoryGame.playTurn(game, 0);
      const card = memoryGame.playTurn(game, 2);
      expect(card).toBe(2);
      expect(game.shownCards[0]).toBe(-1);
      expect(game.shownCards[2]).toBe(-1);
      expect(game.moves).toBe(1);
    });

    it('should throw if selecting same card twice', () => {
      memoryGame.playTurn(game, 0);
      expect(() => memoryGame.playTurn(game, 0)).toThrow(BadRequestException);
    });

    it('should throw if selecting an already discovered card', () => {
      memoryGame.playTurn(game, 0);
      memoryGame.playTurn(game, 1);
      expect(() => memoryGame.playTurn(game, 0)).toThrow(BadRequestException);
    });

    it('should throw if selecting out of bounds', () => {
      expect(() => memoryGame.playTurn(game, 99)).toThrow(BadRequestException);
    });

    it('should throw if playing after game is ended', () => {
      game.shownCards = [1, 1, 2, 2];
      game.isEndOfGame = true;
      expect(() => memoryGame.playTurn(game, 0)).toThrow(BadRequestException);
    });

    it('should throw if the same card is selected', () => {
      game.runningMove = 0;
      expect(() => memoryGame.playTurn(game, 0)).toThrow(BadRequestException);
    });

    it('should throw if all cards are discovered', () => {
      game.shownCards = [1, 1, 2, 2];
      expect(() => memoryGame.playTurn(game, 0)).toThrow(BadRequestException);
    });
  });
});
