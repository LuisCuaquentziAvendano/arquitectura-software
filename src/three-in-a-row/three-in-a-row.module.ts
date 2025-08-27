import { Module } from '@nestjs/common';
import { ThreeInARowController } from './three-in-a-row.controller';
import { ThreeInARowService } from './three-in-a-row.service';

@Module({
  controllers: [ThreeInARowController],
  providers: [ThreeInARowService],
})
export class ThreeInARowModule {}
