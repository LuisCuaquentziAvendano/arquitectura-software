import { Module } from '@nestjs/common';
import { MemoryController } from './memory.controller';
import { MemoryService } from './memory.service';
import { MemoryGame } from './memory-game';
import { MongooseModule } from '@nestjs/mongoose';
import { Memory, MemorySchema } from 'src/repositories/memory.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
  ],
  controllers: [MemoryController],
  providers: [MemoryService, MemoryGame],
})
export class MemoryModule {}
