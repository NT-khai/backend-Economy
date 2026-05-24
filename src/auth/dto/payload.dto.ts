import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class PayloadDto {
  @IsNumber()
  id?: number;

  @IsString()
  full_name?: string;

  @IsBoolean()
  active?: boolean;

  @IsEnum(['admin', 'user'])
  role?: string;
}
