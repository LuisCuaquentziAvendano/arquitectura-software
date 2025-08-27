import { Injectable } from '@nestjs/common';
import { ThreeInARowGame } from './three-in-a-row-game';
import { ThreeInARow } from 'src/types/three-in-a-row';

@Injectable()
export class ThreeInARowService {
  game: ThreeInARow;

  constructor(private readonly threeInARowGame: ThreeInARowGame) {}

  startGame(): ThreeInARow {
    this.game = this.threeInARowGame.startGame();
    return this.game;
  }

  playUserTurn(i: number, j: number): ThreeInARow {
    this.threeInARowGame.playUserTurn(this.game, i, j);
    return this.game;
  }
}
