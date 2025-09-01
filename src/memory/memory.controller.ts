import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { User } from 'src/repositories/user.repository';
import { MemoryService } from './memory.service';
import { MemoryDto } from './dto/memory.dto';
import type { Request } from 'express';

@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Post('start-game')
  @HttpCode(HttpStatus.OK)
  startGame(@Body() pairs: number, @Req() req: Request): Promise<MemoryDto> {
    const user = req.user as User;
    return this.memoryService.startGame(user, pairs);
  }

  @Post('play-turn')
  @HttpCode(HttpStatus.OK)
  playTurn(@Body() position: number, @Req() req: Request): Promise<number> {
    const user = req.user as User;
    return this.memoryService.playTurn(user, position);
  }

  @Get('game-status')
  gameStatus(@Req() req: Request): Promise<MemoryDto> {
    const user = req.user as User;
    return this.memoryService.gameStatus(user);
  }
}
