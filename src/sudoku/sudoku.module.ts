import { Module } from '@nestjs/common';
import { SudokuController } from './sudoku.controller';
import { SudokuService } from './sudoku.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sudoku, SudokuSchema } from '../repositories/sudoku.repository';
import { SudokuGame } from './sudoku-game';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sudoku.name, schema: SudokuSchema }]),
  ],
  controllers: [SudokuController],
  providers: [SudokuService, SudokuGame],
})
export class SudokuModule {}
