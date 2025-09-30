export interface MemoryDto {
  shownCards: number[];
  moves: number;
  isEndOfGame: boolean;
  gameTime: string;
}

export const UNKNOWN_CARD = -1;
