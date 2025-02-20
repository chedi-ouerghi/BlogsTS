import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/users/auth.controller';
import { AuthService } from '../src/users/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ message: 'User registered' }),
    validateUser: jest
      .fn()
      .mockResolvedValue({ _id: '123', email: 'test@test.com' }),
    login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
    getProfile: jest
      .fn()
      .mockResolvedValue({ _id: '123', email: 'test@test.com' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { _id: '123', email: 'test@test.com' };
          return true;
        }),
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Test de base : vérifier que le contrôleur est défini
  it('devrait être défini', () => {
    expect(authController).toBeDefined();
  });

  // Test d'enregistrement d'un utilisateur
  it('devrait enregistrer un utilisateur', async () => {
    const dto = { email: 'test@test.com', password: 'password' };
    await expect(authController.register(dto)).resolves.toEqual({
      message: 'User registered',
    });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  // Test d'enregistrement avec un e-mail déjà utilisé
  it("devrait échouer lors de l'enregistrement avec un e-mail déjà utilisé", async () => {
    mockAuthService.register.mockRejectedValueOnce(
      new Error('Email already in use'),
    );
    const dto = { email: 'test@test.com', password: 'password' };

    await expect(authController.register(dto)).rejects.toThrow(
      'Email already in use',
    );
  });

  // Test de connexion d'un utilisateur
  it('devrait connecter un utilisateur', async () => {
    const dto = { email: 'test@test.com', password: 'password' };
    await expect(authController.login(dto)).resolves.toEqual({
      access_token: 'jwt_token',
    });
    expect(authService.validateUser).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(authService.login).toHaveBeenCalled();
  });

  // Test de connexion avec des identifiants incorrects
  it('devrait échouer lors de la connexion avec des identifiants incorrects', async () => {
    mockAuthService.validateUser.mockResolvedValueOnce(null); // Utilisateur non trouvé
    const dto = { email: 'wrong@test.com', password: 'wrongpassword' };

    await expect(authController.login(dto)).rejects.toThrow(
      'Invalid credentials',
    );
  });

  // Test pour récupérer le profil utilisateur
  it("devrait retourner le profil de l'utilisateur", async () => {
    const req = { user: { _id: '123' } };
    await expect(authController.getProfile(req)).resolves.toEqual({
      _id: '123',
      email: 'test@test.com',
    });
    expect(authService.getProfile).toHaveBeenCalledWith('123');
  });

  // Test pour récupérer le profil sans utilisateur authentifié
  it('devrait échouer lors de la récupération du profil sans utilisateur', async () => {
    const req = { user: null }; // Pas d'utilisateur dans la requête

    await expect(authController.getProfile(req)).rejects.toThrow();
  });

  // Test pour gérer une erreur du service lors de l'enregistrement
  it("devrait gérer les erreurs du service lors de l'enregistrement", async () => {
    mockAuthService.register.mockRejectedValueOnce(new Error('Service error'));
    const dto = { email: 'test@test.com', password: 'password' };

    await expect(authController.register(dto)).rejects.toThrow('Service error');
  });

  // Test pour vérifier que les données sont correctement transmises au service
  it("devrait appeler le service avec les bonnes données pour l'enregistrement", async () => {
    const dto = { email: 'newuser@test.com', password: 'securepassword' };

    await authController.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });
});
