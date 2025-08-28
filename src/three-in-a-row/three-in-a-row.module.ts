import { Module } from '@nestjs/common';
import { ThreeInARowController } from './three-in-a-row.controller';
import { ThreeInARowService } from './three-in-a-row.service';
import { ThreeInARowGame } from './three-in-a-row-game';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ThreeInARow,
  ThreeInARowSchema,
} from 'src/repositories/three-in-a-row.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThreeInARow.name, schema: ThreeInARowSchema },
    ]),
  ],
  controllers: [ThreeInARowController],
  providers: [ThreeInARowService, ThreeInARowGame],
})
export class ThreeInARowModule {}
