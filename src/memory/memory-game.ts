import { BadRequestException, Injectable } from '@nestjs/common';
import { Memory } from 'src/repositories/memory.repository';
import { shuffleArray } from 'src/utils/random';
import { UNKNOWN_CARD } from './dto/memory.dto';

@Injectable()
export class MemoryGame {
  private readonly NO_MOVE = -1;

  startGame(pairs: number): Memory {
    const shuffledCards = new Array<number>(pairs * 2).fill(0);
    shuffledCards.forEach((_, i) => (shuffledCards[i] = (i % pairs) + 1));
    shuffleArray(shuffledCards);
    const shownCards = new Array<number>(pairs * 2).fill(UNKNOWN_CARD);
    return { shuffledCards, shownCards, moves: 0, runningMove: this.NO_MOVE };
  }

  playTurn(game: Memory, position: number): number {
    if (this.isEndOfGame(game))
      throw new BadRequestException('The game is already over');
    if (!this.isInsideBounds(game, position))
      throw new BadRequestException('Invalid position');
    if (this.isCardDiscovered(game, position))
      throw new BadRequestException('This card is already discovered');
    if (this.isFirstCardSelected(game))
      return this.playFirstTurn(game, position);
    return this.playSecondTurn(game, position);
  }

  private isEndOfGame(game: Memory): boolean {
    return !game.shownCards.includes(UNKNOWN_CARD);
  }

  private isInsideBounds(game: Memory, position: number): boolean {
    return 0 <= position && position < game.shuffledCards.length;
  }

  private isFirstCardSelected(game: Memory): boolean {
    return game.runningMove == this.NO_MOVE;
  }

  private isCardDiscovered(game: Memory, position: number): boolean {
    return game.shownCards[position] != UNKNOWN_CARD;
  }

  private playFirstTurn(game: Memory, position: number): number {
    game.runningMove = position;
    return game.shuffledCards[position];
  }

  private playSecondTurn(game: Memory, position: number): number {
    if (game.runningMove == position)
      throw new BadRequestException('The same card was selected');
    const lastCard = game.shuffledCards[game.runningMove];
    const currentCard = game.shuffledCards[position];
    if (lastCard == currentCard) {
      game.shownCards[game.runningMove] = lastCard;
      game.shownCards[position] = currentCard;
    }
    game.runningMove = this.NO_MOVE;
    game.moves++;
    return currentCard;
  }
}
