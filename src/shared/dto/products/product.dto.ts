import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20, { message: 'size 20 dan katta bo‘lmasligi kerak' })
  size: number;
}
