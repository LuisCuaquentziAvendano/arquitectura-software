import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ThreeInARow {
  @Prop({ required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  board: number[][];

  @Prop({ required: true })
  isEndOfGame: boolean;

  @Prop({ required: true })
  winningBoxes: number[][];
}

export const ThreeInARowSchema = SchemaFactory.createForClass(ThreeInARow);
