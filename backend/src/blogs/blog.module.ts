import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog, BlogSchema } from '../schemas/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
