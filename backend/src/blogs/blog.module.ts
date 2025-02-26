import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
