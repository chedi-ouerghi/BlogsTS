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

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Request() req,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log('🔍 Utilisateur connecté:', req.user);
      console.log('📸 Fichiers reçus:', files); 

      createBlogDto.author = req.user._id;

      if (files && files.length > 0) {
        createBlogDto.images = files.map((file) => file.path);
      } else {
        createBlogDto.images = null;
      }

      const blog = await this.blogService.create(createBlogDto);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Blog créé avec succès',
        data: blog,
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création du blog:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Erreur lors de la création du blog',
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
      console.log('📄 Liste des blogs récupérée avec succès.');
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Liste des blogs récupérée avec succès',
        data: blogs,
      });
    } catch (error) {
      console.error(
        '❌ Erreur lors de la récupération des blogs :',
        error.message,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erreur lors de la récupération des blogs',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const blog = await this.blogService.findOne(id);
      if (!blog) {
        console.warn(`⚠️ Blog avec ID ${id} non trouvé.`);
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Blog avec ID ${id} non trouvé`,
        });
      }
      console.log('🔍 Blog récupéré avec succès :', blog);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog récupéré avec succès',
        data: blog,
      });
    } catch (error) {
      console.error(
        '❌ Erreur lors de la récupération du blog :',
        error.message,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erreur lors de la récupération du blog',
      });
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (files && files.length > 0) {
        updateBlogDto.images = files.map((file) => file.path);
      } else {
        updateBlogDto.images = null;
      }

      const updatedBlog = await this.blogService.update(
        id,
        updateBlogDto,
        req.user._id,
      );

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
      await this.blogService.delete(id, req.user._id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Blog supprimé avec succès',
      });
    } catch (error) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du blog',
      });
    }
  }
}
