/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { Box, ThreeInARowDto } from './dto/three-in-a-row.dto';
import { selectRandomFromArray } from '../utils/random';

@Injectable()
export class ThreeInARowGame {
  private readonly BOARD_ROWS = 3;
  private readonly BOARD_COLS = 3;
  private readonly allWinningBoxes = [
    // rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  startGame(): ThreeInARowDto {
    const game: ThreeInARowDto = {
      board: this.initializeBoard(),
      isEndOfGame: false,
      winningBoxes: [],
    };
    const initialTurn = this.getRandomTurn();
    if (initialTurn == Box.SERVER) this.playServerTurn(game.board);
    return game;
  }

  playUserTurn(game: ThreeInARowDto, i: number, j: number): void {
    if (game.isEndOfGame) throw new BadRequestException('Invalid movement');
    if (game.board[i][j] != Box.EMPTY) throw new BadRequestException('Position on the board occupied');
    game.board[i][j] = Box.USER;
    this.checkEndOfGame(game);
    if (game.isEndOfGame) return;
    this.playServerTurn(game.board);
    this.checkEndOfGame(game);
  }

  private initializeBoard(): Box[][] {
    return [
      [Box.EMPTY, Box.EMPTY, Box.EMPTY],
      [Box.EMPTY, Box.EMPTY, Box.EMPTY],
      [Box.EMPTY, Box.EMPTY, Box.EMPTY],
    ];
  }

  private getRandomTurn(): Box {
    const players = [Box.USER, Box.SERVER];
    return selectRandomFromArray(players);
  }

  private playServerTurn(board: Box[][]): void {
    const emptyBoxes = this.getEmptyBoxes(board);
    const box = selectRandomFromArray(emptyBoxes);
    const i = box[0],
      j = box[1];
    board[i][j] = Box.SERVER;
  }

  private getEmptyBoxes(board: Box[][]): number[][] {
    const emptyBoxes: number[][] = [];
    for (let i = 0; i < this.BOARD_ROWS; i++)
      for (let j = 0; j < this.BOARD_COLS; j++)
        if (board[i][j] == Box.EMPTY) emptyBoxes.push([i, j]);
    return emptyBoxes;
  }

  private checkEndOfGame(game: ThreeInARowDto): void {
    this.checkWinningBoxes(game);
    if (game.isEndOfGame) return;
    const emptyBoxes = this.getEmptyBoxes(game.board);
    game.isEndOfGame = emptyBoxes.length == 0;
  }

  private checkWinningBoxes(game: ThreeInARowDto): void {
    for (const boxesInLine of this.allWinningBoxes) {
      const [i, j] = boxesInLine[0];
      const player = game.board[i][j];
      if (player == Box.EMPTY) continue;
      let playerIsWinner = true;
      for (const [i, j] of boxesInLine)
        playerIsWinner = playerIsWinner && game.board[i][j] == player;
      if (playerIsWinner) {
        game.isEndOfGame = playerIsWinner;
        game.winningBoxes = boxesInLine;
      }
    }
  }
}
