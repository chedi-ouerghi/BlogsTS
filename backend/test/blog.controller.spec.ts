import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '../src/blogs/blog.controller';
import { BlogService } from '../src/blogs/blog.service';
import { CreateBlogDto } from '../src/blogs/dtos/create-blog.dto';
import { UpdateBlogDto } from '../src/blogs/dtos/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('BlogController', () => {
    let controller: BlogController;
    let blogService: BlogService;

    const mockBlogService = {
        create: jest.fn((dto) => ({
            id: '1',
            ...dto,
            createdAt: new Date(),
        })),
        findAll: jest.fn(() => [
            { id: '1', title: 'Blog 1', content: 'Content 1' },
            { id: '2', title: 'Blog 2', content: 'Content 2' },
        ]),
        findOne: jest.fn((id) => {
            if (id === '1') {
                return { id: '1', title: 'Blog 1', content: 'Content 1' };
            }
            throw new Error('Blog non trouvé');
        }),
        update: jest.fn((id, dto) => ({
            id,
            ...dto,
            updatedAt: new Date(),
        })),
        delete: jest.fn((id) => {
            if (id !== '1') throw new Error('Blog non trouvé');
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlogController],
            providers: [{ provide: BlogService, useValue: mockBlogService }],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({
                canActivate: jest.fn((context: ExecutionContext) => true),
            })
            .compile();

        controller = module.get<BlogController>(BlogController);
        blogService = module.get<BlogService>(BlogService);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('doit créer un blog et retourner une réponse', async () => {
            const dto: CreateBlogDto = {
                title: 'New Blog',
                content: 'New Content',
                author: '123',
                tags: [], 
                category: 'SCIENTIFIC' 
            };
            const mockReq = { user: { id: '123' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockFiles = [{ path: 'image1.jpg' }];

            await controller.create(dto, mockReq, mockRes as any, mockFiles as any);

            expect(blogService.create).toHaveBeenCalledWith({
                ...dto,
                images: ['image1.jpg'],
                author: '123',
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('findAll', () => {
        it('doit récupérer tous les blogs', async () => {
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await controller.findAll('1', '5', mockRes as any);

            expect(blogService.findAll).toHaveBeenCalledWith('1', '5');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('findOne', () => {
        it('doit récupérer un blog spécifique', async () => {
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await controller.findOne('1', mockRes as any);

            expect(blogService.findOne).toHaveBeenCalledWith('1');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('doit retourner une erreur si le blog n\'existe pas', async () => {
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await controller.findOne('99', mockRes as any);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('update', () => {
        it('doit mettre à jour un blog', async () => {
            const dto: UpdateBlogDto = { title: 'Updated Title', content: 'Updated Content' };
            const mockReq = { user: { id: '123' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockFiles = [{ path: 'newImage.jpg' }];

            await controller.update('1', dto, mockReq, mockRes as any, mockFiles as any);

            expect(blogService.update).toHaveBeenCalledWith('1', { ...dto, images: ['newImage.jpg'] }, '123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe('delete', () => {
        it('doit supprimer un blog', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            await controller.delete('1', mockReq, mockRes as any);

            expect(blogService.delete).toHaveBeenCalledWith('1', '123');
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('doit retourner une erreur si le blog n\'existe pas', async () => {
            const mockReq = { user: { id: '123' } };
            const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await controller.delete('99', mockReq, mockRes as any);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });
});
