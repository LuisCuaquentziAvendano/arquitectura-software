import { Module } from '@nestjs/common';
import { ThreeInARowController } from './three-in-a-row.controller';
import { ThreeInARowService } from './three-in-a-row.service';
import { ThreeInARowGame } from './three-in-a-row-game';

@Module({
  controllers: [ThreeInARowController],
  providers: [ThreeInARowService, ThreeInARowGame],
})
export class ThreeInARowModule {}
