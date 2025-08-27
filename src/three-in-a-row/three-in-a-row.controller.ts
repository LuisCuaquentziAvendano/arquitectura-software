import { Body, Controller, Post } from '@nestjs/common';
import { ThreeInARowService } from './three-in-a-row.service';
import type { ThreeInARow } from 'src/types/three-in-a-row';
import { BoardPositionDto } from './dto/board-position.dto';

@Controller('api/v1/three-in-a-row')
export class ThreeInARowController {
  constructor(private readonly threeInARowService: ThreeInARowService) {}

  @Post('start-game')
  startGame(): ThreeInARow {
    return this.threeInARowService.startGame();
  }

  @Post('play-user-turn')
  playUserTurn(@Body() position: BoardPositionDto): ThreeInARow {
    return this.threeInARowService.playUserTurn(position.row, position.col);
  }
}
