import { IsInt, IsOptional, Min } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  @Min(1)
  product_id!: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  qty?: number;
}
