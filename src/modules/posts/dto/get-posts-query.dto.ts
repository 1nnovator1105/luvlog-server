import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class GetPostsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '0';

  @IsOptional()
  @IsNumberString()
  readLimit?: string = '5';

  @IsOptional()
  @IsNumberString()
  totalCnt?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class GetPostsStatusQueryDto {
  @IsOptional()
  @IsNumberString()
  readLimit?: string = '5';

  @IsOptional()
  @IsString()
  role?: string;
}