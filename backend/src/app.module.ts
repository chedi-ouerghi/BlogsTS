import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './users/auth.module';
import { BlogModule } from './blogs/blog.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
