import { IsInt } from 'class-validator';

export class CardPositionDto {
  @IsInt()
  position: number;
}
