import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { BlogStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) { }


async create(createBlogDto: CreateBlogDto) {
  const { title, content, tags, category, images, status = 'PENDING', author } = createBlogDto;

  const imageArray = images || [];

  
  const tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;

  return this.prisma.blog.create({
    data: {
      title,
      content,
      tags: tagsArray, 
      category,
      images: imageArray,
      status,
      author: {
        connect: { id: author },
      },
    },
  });
}



  async findAll(page: string, limit: string) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    
    const approvedStatus = BlogStatus.APPROVED;

    const totalBlogs = await this.prisma.blog.count({
      where: {
        status: approvedStatus, 
      },
    });
    const totalPages = totalBlogs > 0 ? Math.ceil(totalBlogs / limitNumber) : 1;

    const blogs = totalBlogs > 0
      ? await this.prisma.blog.findMany({
        where: {
          status: approvedStatus, 
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      })
      : [];

    return { blogs, page: pageNumber, totalPages };
  }

 async findOne(id: string) {
  return this.prisma.blog.findUnique({
    where: { id },
    include: { author: { select: { username: true } } }, 
  });
}


  async findByCategory(category: string) {
    const approvedStatus = BlogStatus.APPROVED;

    const blogs = await this.prisma.blog.findMany({
      where: {
        status: approvedStatus,
        category,
      },
    });

    return blogs;
  }


  async update(id: string, updateBlogDto: UpdateBlogDto, userId: string, files: Express.Multer.File[]) {
  const blog = await this.prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new NotFoundException('Blog non trouvé');
  }

  if (blog.authorId !== userId) {
    throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce blog");
  }

  let updatedImages = blog.images;

  if (files && files.length > 0) {
    const newImages = files.map(file => file.path);
    updatedImages = [...updatedImages, ...newImages];
  }

  if (updateBlogDto.images) {
    updatedImages = updateBlogDto.images;
  }

  return this.prisma.blog.update({
    where: { id },
    data: {
      title: updateBlogDto.title || blog.title,
      content: updateBlogDto.content || blog.content,
    tags: Array.isArray(updateBlogDto.tags) ? updateBlogDto.tags : JSON.parse(updateBlogDto.tags),
      category: updateBlogDto.category || blog.category,
      images: updatedImages,
    },
  });
}




  async delete(id: string, userId: string): Promise<void> {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!blog) {
      throw new NotFoundException('Blog non trouvé');
    }

    if (blog.author.id !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce blog');
    }

    await this.prisma.blog.delete({
      where: { id },
    });
  }

  // admin
async findAllForAdmin(userRole: string) {
  console.log('User Role:', userRole); 
  if (userRole !== 'ADMIN') {
    throw new ForbiddenException('Seul un administrateur peut voir tous les blogs');
  }

  
  const blogs = await this.prisma.blog.findMany();
  console.log('Blogs récupérés :', blogs);  

  if (!blogs || blogs.length === 0) {
    throw new NotFoundException('Aucun blog trouvé');
  }

  return { blogs }; 
}


async updateStatusAdmin(id: string, status: BlogStatus, userRole: string) {
  if (userRole !== 'ADMIN') {
    throw new ForbiddenException('Seul un administrateur peut mettre à jour le statut du blog');
  }

  const blog = await this.prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new NotFoundException('Blog non trouvé');
  }

  return this.prisma.blog.update({
    where: { id },
    data: { status },
  });
}

}
