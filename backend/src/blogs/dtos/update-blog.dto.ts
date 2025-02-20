import { IsString, IsArray, IsIn, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsIn(['Scientific', 'IT'])
  category: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional() 
  @IsArray()
  images: string[] | null; 
}
