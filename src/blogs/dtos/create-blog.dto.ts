import {
  IsString,
  IsArray,
  IsIn,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsIn(['Scientific', 'IT'])
  category: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsArray()
  images: string[] = [];
}
