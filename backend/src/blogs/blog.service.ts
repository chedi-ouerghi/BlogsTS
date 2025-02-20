import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from '../schemas/Blog.schema';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const blog = new this.blogModel({
      ...createBlogDto,
      author: createBlogDto.author,
      status: 'approved',
    });
    return blog.save();
  }

  async findAll(page: string, limit: string) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const totalBlogs = await this.blogModel.countDocuments({});
    const totalPages = totalBlogs > 0 ? Math.ceil(totalBlogs / limitNumber) : 1;

    const blogs =
      totalBlogs > 0
        ? await this.blogModel
            .find()
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
        : [];

    return { blogs, page: pageNumber, totalPages };
  }

  async findOne(id: string) {
    return this.blogModel.findById(id);
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    userId: string,
  ): Promise<Blog> {
    
    const blog = await this.blogModel.findById(id).populate('author');

    if (!blog) {
      throw new NotFoundException('Blog non trouvé');
    }

    console.log(
      `Blog Author: ${blog.author ? blog.author._id : 'undefined'}, User ID: ${userId}`,
    );

    
    if (blog.author && !blog.author._id.equals(userId)) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce blog');
    }

    
    Object.assign(blog, updateBlogDto);
    return blog.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const blog = await this.blogModel.findById(id).populate('author'); 

    if (!blog) {
      throw new NotFoundException('Blog non trouvé');
    }

    console.log(
      `Blog Author: ${blog.author ? blog.author._id : 'undefined'}, User ID: ${userId}`,
    );

    
    const userObjectId = new Types.ObjectId(userId);

    
    if (!blog.author || !blog.author._id.equals(userObjectId)) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce blog');
    }

    await this.blogModel.findByIdAndDelete(id);
  }
}
