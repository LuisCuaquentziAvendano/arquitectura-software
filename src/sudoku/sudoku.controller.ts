import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SudokuService } from './sudoku.service';
import { SudokuDto } from './dto/sudoku.dto';
import { User } from 'src/repositories/user.repository';
import type { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/sudoku')
export class SudokuController {
  constructor(private readonly sudokuService: SudokuService) {}

  @Post('start-game')
  @HttpCode(HttpStatus.OK)
  startGame(@Req() req: Request): Promise<SudokuDto> {
    const user = req.user as User;
    const difficulty = 1; // Easy
    return this.sudokuService.startGame(user, difficulty);
  }
}
