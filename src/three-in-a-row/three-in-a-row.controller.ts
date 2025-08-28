import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ThreeInARowService } from './three-in-a-row.service';
import type { ThreeInARowDto } from 'src/three-in-a-row/dto/three-in-a-row.dto';
import { BoardPositionDto } from './dto/board-position.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/repositories/user.repository';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/three-in-a-row')
export class ThreeInARowController {
  constructor(private readonly threeInARowService: ThreeInARowService) {}

  @Post('start-game')
  @HttpCode(HttpStatus.OK)
  startGame(@Req() req: Request): Promise<ThreeInARowDto> {
    const user = req.user as User;
    return this.threeInARowService.startGame(user);
  }

  @Post('play-user-turn')
  @HttpCode(HttpStatus.OK)
  playUserTurn(
    @Body() position: BoardPositionDto,
    @Req() req: Request,
  ): Promise<ThreeInARowDto> {
    const user = req.user as User;
    return this.threeInARowService.playUserTurn(
      user,
      position.row,
      position.col,
    );
  }
}
