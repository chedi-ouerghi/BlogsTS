import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Category, BlogStatus } from '@prisma/client';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  tags: string[];

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;  

  @IsString()
  author: string;  
}
