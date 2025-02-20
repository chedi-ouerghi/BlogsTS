import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../src/blogs/blog.controller';
import { BlogService } from '../src/blogs/blog.service';
import { CreateBlogDto } from '../src/blogs/dtos/create-blog.dto';
import { UpdateBlogDto } from '../src/blogs/dtos/update-blog.dto';
import { Request, Response } from 'express';

describe('BlogController', () => {
  let blogController: BlogController;
  let blogService: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    blogController = module.get<BlogController>(BlogController);
    blogService = module.get<BlogService>(BlogService);
  });

  
  const req: Partial<Request> = {
    user: { id: '123' }, 
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn(),
    send: jest.fn(),
    links: jest.fn(),
    jsonp: jest.fn(),
    contentType: jest.fn(),
    type: jest.fn(),
    download: jest.fn(),
    sendFile: jest.fn(),
  };

 it('should create a blog', async () => {
   const dto: CreateBlogDto = {
     title: 'Test Blog',
     content: 'This is a test blog',
     category: 'IT', 
     tags: ['nestjs', 'typescript'], 
     author: 'John Doe', 
     images: [], 
   };

   await blogController.create(dto, req as Request, res as Response, []);

   expect(res.status).toHaveBeenCalledWith(201);
   expect(res.json).toHaveBeenCalled();
 });


  it('should get all blogs', async () => {
    await blogController.findAll('1', '5', res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('should get one blog', async () => {
    await blogController.findOne('1', res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

 it('should update a blog', async () => {
   const updateDto: UpdateBlogDto = {
     title: 'Updated Blog',
     content: 'Updated content',
     category: 'Scientific', 
     tags: ['update', 'science'], 
     images: null, 
   };

   await blogController.update(
     '1',
     updateDto,
     req as Request,
     res as Response,
     [],
   );

   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.json).toHaveBeenCalled();
 });
 

it('should delete a blog', async () => {
  await blogController.delete('1', req as Request, res as Response);

  expect(res.status).toHaveBeenCalledWith(200); 
  expect(res.sendStatus).toHaveBeenCalledWith(200); 
});

});
