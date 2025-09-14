import { Injectable } from '@nestjs/common';
import { SudokuGame } from './sudoku-game';
import { SudokuDto } from 'src/sudoku/dto/sudoku.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sudoku } from 'src/repositories/sudoku.repository';
import { Model } from 'mongoose';
import { User } from 'src/repositories/user.repository';

@Injectable()
export class SudokuService {
  constructor(
    private readonly sudokuGame: SudokuGame,
    @InjectModel(Sudoku.name)
    private readonly sudokuRepository: Model<Sudoku>,
  ) {}

  async startGame(user: User, difficulty: number): Promise<SudokuDto> {
    const game = this.sudokuGame.generateBoard(difficulty);
    await this.sudokuRepository.findOneAndUpdate({ userId: user._id }, game, {
      upsert: true,
    });
    return game;
  }
}
