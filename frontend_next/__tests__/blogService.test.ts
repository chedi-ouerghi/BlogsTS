import axios from 'axios';
import { createBlog, updateBlog, getAllBlogs, getOneBlog, getBlogsByCategory, updateBlogStatus } from '../src/services/blogService';
import Cookies from 'js-cookie';

// Mock axios
jest.mock('axios');
jest.mock('jsonwebtoken', () => ({
    decode: jest.fn(() => ({ id: '123' })) // Simule le décodage
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Blog Service', () => {
    beforeEach(() => {
        // Nettoyer les cookies et réinitialiser les mocks avant chaque test
        Cookies.set("token", "valid.token.string");
    });

    it('devrait créer un blog', async () => {
        // Simuler la réponse de l'API
        mockedAxios.post.mockResolvedValue({ data: { success: true, blog: {} } });

        const result = await createBlog('Titre', 'Contenu', ['tag1'], 'catégorie', [], 'valid.token.string');
        expect(result).toEqual({ success: true, blog: {} });
    });

    it('devrait mettre à jour un blog', async () => {
        // Simuler la réponse de l'API
        mockedAxios.put.mockResolvedValue({ data: { success: true, blog: {} } });

        const result = await updateBlog('123', 'Titre modifié', 'Contenu modifié', ['tag1'], 'catégorie', []);
        expect(result).toEqual({ success: true, blog: {} });
    });

    it('devrait lever une erreur si le token est manquant', async () => {
        // Simuler l'absence de token
        Cookies.remove('token');

        await expect(createBlog('Titre', 'Contenu', ['tag1'], 'catégorie', [], '')).rejects.toThrow('Token manquant');
    });

    it('devrait lever une erreur si le token est invalide', async () => {
        // Passer un token invalide pour les tests
        Cookies.set("token", "invalid.token");

        await expect(updateBlog('123', 'Titre', 'Contenu', ['tag1'], 'catégorie', [])).rejects.toThrow('Token invalide');
    });

    it('devrait obtenir tous les blogs', async () => {
        // Simuler la réponse de l'API
        mockedAxios.get.mockResolvedValue({ data: { data: { blogs: [] } } });

        const result = await getAllBlogs();
        expect(result).toEqual([]);
    });

    it('devrait obtenir un blog par ID', async () => {
        mockedAxios.get.mockResolvedValue({ data: { data: {} } });

        const result = await getOneBlog('123');
        expect(result).toEqual({});
    });

    it('devrait obtenir les blogs par catégorie', async () => {
        mockedAxios.get.mockResolvedValue({ data: { data: [] } });

        const result = await getBlogsByCategory('catégorie');
        expect(result).toEqual([]);
    });

    it('devrait mettre à jour le statut d\'un blog', async () => {
        mockedAxios.put.mockResolvedValue({ data: { success: true } });

        await expect(updateBlogStatus('123', 'publié')).resolves.toEqual({ success: true });
    });
});
