import { Injectable } from '@nestjs/common';
import { Cell, SudokuDto } from './dto/sudoku.dto';

@Injectable()
export class SudokuGame {
  private readonly BOARD_SIZE = 9;
  private readonly TOTAL_CELLS = 81;

  createEmptyBoard(): Cell[][] {
    const board: Cell[][] = [];
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      const newRow: Cell[] = [];
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        newRow.push({ row, col, value: null, editable: true });
      }
      board.push(newRow);
    }
    return board;
  }

  private shuffle(array: number[]): number[] {
    let currentIndex = array.length,
      randomIndex: number;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  private isValid(
    board: Cell[][],
    row: number,
    col: number,
    num: number,
  ): boolean {
    //check row
    for (let i = 0; i < 9; i++) {
      if (board[row]?.[i]?.value === num) {
        return false;
      }
    }

    //check column
    for (let i = 0; i < 9; i++) {
      if (board[i]?.[col]?.value === num) {
        return false;
      }
    }

    //check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow]?.[j + startCol]?.value === num) {
          return false;
        }
      }
    }

    return true;
  }

  solveSudoku(board: Cell[][], row = 0, col = 0): boolean {
    if (row == this.BOARD_SIZE) return true; // Solved
    if (col == this.BOARD_SIZE) return this.solveSudoku(board, row + 1, 0);

    if (board[row][col].value !== null) {
      return this.solveSudoku(board, row, col + 1);
    }

    const numbers = this.shuffle(
      Array.from({ length: this.BOARD_SIZE }, (_, i) => i + 1),
    );
    for (const num of numbers) {
      if (this.isValid(board, row, col, num)) {
        board[row][col].value = num;
        board[row][col].editable = false;
        if (this.solveSudoku(board, row, col + 1)) {
          return true;
        }
        board[row][col].value = null;
        board[row][col].editable = true;
      }
    }
    return false;
  }

  generateBoard(difficulty: number): SudokuDto {
    const game: SudokuDto = {
      board: this.createEmptyBoard(),
      isEndOfGame: false,
      isUserWinner: false,
    };

    this.solveSudoku(game.board);
    const cellsToRemove = Math.floor(this.TOTAL_CELLS * difficulty);

    let removedCells = 0;
    while (removedCells < cellsToRemove) {
      const row = Math.floor(Math.random() * this.BOARD_SIZE);
      const col = Math.floor(Math.random() * this.BOARD_SIZE);
      if (
        game.board[row][col].value !== null &&
        game.board[row][col].value !== undefined
      ) {
        game.board[row][col].value = null;
        game.board[row][col].editable = true;
        removedCells++;
      }
    }

    return game;
  }
}
