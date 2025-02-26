import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/users/auth.controller';
import { AuthService } from '../src/users/auth.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        register: jest.fn(),
        validateUser: jest.fn(),
        login: jest.fn(),
        getProfile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('register', () => {
        it('should successfully register a user', async () => {
            const mockUser = { username: 'testUser', email: 'test@example.com' };
            mockAuthService.register.mockResolvedValue(mockUser);

            const result = await authController.register(mockUser);

            expect(result).toEqual({
                message: 'User successfully registered',
                user: mockUser,
            });
            expect(authService.register).toHaveBeenCalledWith(mockUser);
        });

        it('should throw an UnauthorizedException if registration fails', async () => {
            mockAuthService.register.mockRejectedValue(new Error('Registration failed'));

            await expect(authController.register({})).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should successfully log in a user and return a token', async () => {
            const mockUser = { username: 'testUser', email: 'test@example.com' };
            const mockToken = { access_token: 'valid_token' };

            mockAuthService.validateUser.mockResolvedValue(mockUser);
            mockAuthService.login.mockResolvedValue(mockToken);

            const result = await authController.login({ email: 'test@example.com', password: '123456' });

            expect(result).toEqual(mockToken);
            expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', '123456');
            expect(authService.login).toHaveBeenCalledWith(mockUser);
        });

        it('should throw an UnauthorizedException if login fails', async () => {
            mockAuthService.validateUser.mockRejectedValue(new Error('Invalid credentials'));

            await expect(authController.login({ email: 'test@example.com', password: 'wrong' }))
                .rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getProfile', () => {
        it('should return user profile when authenticated', async () => {
            const mockUser = { id: '123', username: 'testUser' };
            mockAuthService.getProfile.mockResolvedValue(mockUser);

            const req = { user: { id: '123' } };
            const result = await authController.getProfile(req);

            expect(result).toEqual(mockUser);
            expect(authService.getProfile).toHaveBeenCalledWith('123');
        });

        it('should throw NotFoundException if profile not found', async () => {
            mockAuthService.getProfile.mockRejectedValue(new Error('User not found'));

            await expect(authController.getProfile({ user: { id: '123' } }))
                .rejects.toThrow(NotFoundException);
        });
    });
});
