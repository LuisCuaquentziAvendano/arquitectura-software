import { Box, ThreeInARow } from '../types/threeInARow';
import { selectRandomFromArray } from '../utils/random';

class ThreeInARowService {
    readonly BOARD_ROWS = 3;
    readonly BOARD_COLS = 3;
    readonly allWinningBoxes = [
        // rows
        [[0,0], [0,1], [0,2]],
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],
        // columns
        [[0,0], [1,0], [2,0]],
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]],
        // diagonals
        [[0,0], [1,1], [2,2]],
        [[2,0], [1,1], [0,2]],
    ];

    startGame(): ThreeInARow {
        const game: ThreeInARow = {
            board: this.initializeBoard(),
        };
        const initialTurn = this.getRandomTurn();
        if (initialTurn == Box.SERVER)
            this.playServerTurn(game.board);
        return game;
    }

    playUserTurn(game: ThreeInARow, i: number, j: number) {
        if (!this.indicesInsideBounds(i, j))
            throw new Error();
        if (game.board[i][j] != Box.EMPTY)
            throw new Error();
        game.board[i][j] = Box.USER;
        const { isEndOfGame, winningBoxes } = this.checkEndOfGame(game.board);
        if (isEndOfGame) {
            game.isEndOfGame = isEndOfGame;
        }
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

    private playServerTurn(board: Box[][]) {
        const emptyBoxes = this.getEmptyBoxes(board);
        const box = selectRandomFromArray(emptyBoxes);
        const i = box[0], j = box[1];
        board[i][j] = Box.SERVER;
    }

    private getEmptyBoxes(board: Box[][]): number[][] {
        const emptyBoxes: number[][] = [];
        for (let i = 0; i < this.BOARD_ROWS; i++)
            for (let j = 0; j < this.BOARD_COLS; j++)
                if (board[i][j] == Box.EMPTY)
                    emptyBoxes.push([i, j]);
        return emptyBoxes;
    }

    private indicesInsideBounds(i: number, j: number) {
        return 0 <= i && i < this.BOARD_ROWS
            && 0 <= j && j < this.BOARD_COLS;
    }

    private checkEndOfGame(board: Box[][]): EndOfGameResult {
        const emptyBoxes = this.getEmptyBoxes(board);
        if (emptyBoxes.length == 0)
            return { isEndOfGame: true, winningBoxes: [] };
        return this.checkWinningBoxes(board);
    }

    private checkWinningBoxes(board: Box[][]): EndOfGameResult {
        let winningBoxes: number[][] = [];
        for (const boxesInLine of this.allWinningBoxes) {
            const [i, j] = boxesInLine[0];
            const player = board[i][j];
            let playerIsWinner = true;
            for (const [i, j] of boxesInLine)
                playerIsWinner = playerIsWinner && board[i][j] == player;
            if (playerIsWinner)
                winningBoxes = boxesInLine;
        }
        const isEndOfGame = winningBoxes.length > 0;
        return { isEndOfGame, winningBoxes };
    }

    private endGame() {}
}

interface EndOfGameResult {
    isEndOfGame: boolean;
    winningBoxes: number[][];
}
