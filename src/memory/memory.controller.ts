import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/repositories/user.repository';
import { MemoryService } from './memory.service';
import { MemoryDto } from './dto/memory.dto';
import type { Request } from 'express';
import { NumberOfPairsDto } from './dto/number-of-pairs.dto';
import { AuthGuard } from '@nestjs/passport';
import { CardPositionDto } from './dto/card-position.dto';
import { UncoveredCardDto } from './dto/uncovered-card.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Post('start-game')
  @HttpCode(HttpStatus.OK)
  startGame(
    @Body() body: NumberOfPairsDto,
    @Req() req: Request,
  ): Promise<MemoryDto> {
    const user = req.user as User;
    return this.memoryService.startGame(user, body.pairs);
  }

  @Post('play-turn')
  @HttpCode(HttpStatus.OK)
  async playTurn(
    @Body() body: CardPositionDto,
    @Req() req: Request,
  ): Promise<UncoveredCardDto> {
    const user = req.user as User;
    const card = await this.memoryService.playTurn(user, body.position);
    return { card };
  }

  @Get('game-status')
  gameStatus(@Req() req: Request): Promise<MemoryDto> {
    const user = req.user as User;
    return this.memoryService.gameStatus(user);
  }
}
