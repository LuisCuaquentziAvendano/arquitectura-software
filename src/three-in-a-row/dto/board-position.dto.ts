import { IsNumber, Min, Max } from 'class-validator';

export class BoardPositionDto {
  @IsNumber()
  @Min(0)
  @Max(2)
  row: number;

  @IsNumber()
  @Min(0)
  @Max(2)
  col: number;
}
