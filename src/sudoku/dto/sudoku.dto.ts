export interface SudokuDto {
  board: Cell[][];
  isEndOfGame: boolean;
  isUserWinner: boolean;
}

export type Cell = {
  row: number;
  col: number;
  value: number | null;
  editable: boolean;
};
