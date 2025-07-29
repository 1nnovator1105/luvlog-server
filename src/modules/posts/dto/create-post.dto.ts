import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author: string;

  @IsNotEmpty()
  @IsString()
  contents: string;

  @IsBoolean()
  accessLevel: boolean;
}
