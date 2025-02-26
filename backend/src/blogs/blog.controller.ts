import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/multer.config';
import { BlogStatus } from '@prisma/client';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Request() req,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      createBlogDto.author = req.user.id;

      if (files && files.length > 0) {
        createBlogDto.images = files.map((file) => file.path);
      } else {
        createBlogDto.images = [];
      }

      const blog = await this.blogService.create(createBlogDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Blog créé avec succès',
        data: blog,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Erreur lors de la création du blog',
      });
    }
  }



  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  async findAllForAdmin(
    @Request() req,
    @Res() res: Response,
  ) {
    console.log('User Role:', req.user.role);
    try {
      const blogs = await this.blogService.findAllForAdmin(req.user.role);
      console.log('Blogs récupérés pour l\'admin:', blogs);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Liste des blogs récupérée avec succès pour l\'administrateur',
        data: blogs,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des blogs:', error);
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des blogs pour l\'administrateur',
      });
    }
  }


  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Res() res: Response,
  ) {
    try {
      const blogs = await this.blogService.findAll(page, limit);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Liste des blogs récupérée avec succès',
        data: blogs,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des blogs',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const blog = await this.blogService.findOne(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog récupéré avec succès',
        data: blog,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Blog non trouvé',
      });
    }
  }


  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
    @Res() res: Response,
  ) {
    try {
      const blogs = await this.blogService.findByCategory(category);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Liste des blogs récupérée avec succès pour la catégorie',
        data: blogs,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération des blogs par catégorie',
      });
    }
  }


  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const updatedBlog = await this.blogService.update(id, updateBlogDto, req.user.id, files);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog mis à jour avec succès',
        data: updatedBlog,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du blog',
      });
    }
  }



  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      await this.blogService.delete(id, req.user.id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du blog',
      });
    }
  }



  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatusAdmin(
    @Param('id') id: string,
    @Body('status') status: BlogStatus,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const updatedBlog = await this.blogService.updateStatusAdmin(id, status, req.user.role);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Statut du blog mis à jour avec succès',
        data: updatedBlog,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du statut',
      });
    }
  }
}
