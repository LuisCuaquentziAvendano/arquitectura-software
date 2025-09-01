import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Memory {
  @Prop({ required: true, unique: true })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  shuffledCards: number[];

  @Prop({ required: true })
  shownCards: number[];

  @Prop({ required: true })
  moves: number;

  @Prop()
  runningMove: number;
}

export const MemorySchema = SchemaFactory.createForClass(Memory);
