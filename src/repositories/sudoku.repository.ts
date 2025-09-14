import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Sudoku {
  @Prop({ required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  board: number[][];

  @Prop({ default: false })
  isEndOfGame: boolean;

  @Prop({ default: false })
  isUserWinner: boolean;
}

export const SudokuSchema = SchemaFactory.createForClass(Sudoku);
