export interface ThreeInARowDto {
  board: Box[][];
  isEndOfGame: boolean;
  winningBoxes: number[][];
}

export enum Box {
  EMPTY = 0,
  USER = 1,
  SERVER = 2,
}
