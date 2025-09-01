import { IsInt, Max, Min } from 'class-validator';

export class NumberOfPairsDto {
  @IsInt()
  @Min(1)
  @Max(50)
  pairs: number;
}
