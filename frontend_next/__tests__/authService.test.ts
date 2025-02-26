
import axios from "axios";
import Cookies from "js-cookie";
import { loginUser, getProfile, registerUser } from "../src/services/authService";

jest.mock("axios");
jest.mock("js-cookie");

describe("AuthService", () => {
  
  beforeEach(() => {
    
    jest.clearAllMocks();
  });

  it("devrait réussir à se connecter et sauvegarder le token dans les cookies", async () => {
    const mockResponse = {
      data: { access_token: "mock_token" },
    };

    
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    
    
    (Cookies.set as jest.Mock).mockImplementation(() => {});

    const email = "user@test.com";
      const password = "test123";

    
    const result = await loginUser(email, password);

    
    expect(axios.post).toHaveBeenCalledWith("http://localhost:6505/auth/login", { email, password });
    expect(Cookies.set).toHaveBeenCalledWith("token", "mock_token", { expires: 1 / 24 });
    expect(result).toEqual(mockResponse.data);
  });

  it("devrait échouer à se connecter si aucun token n'est retourné", async () => {
    const mockResponse = {
      data: {},
    };

    
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const email = "user@test.com";
    const password = "test123";

    
    await expect(loginUser(email, password)).rejects.toThrow("Token non reçu après connexion");
  });


  it("devrait réussir à récupérer le profil", async () => {
    const mockResponse = { data: { id: 1, name: "chedi" } };

    
    (Cookies.get as jest.Mock).mockReturnValue("mock_token");
    
    
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getProfile();

    expect(axios.get).toHaveBeenCalledWith("http://localhost:6505/auth/profile", {
      headers: { Authorization: "Bearer mock_token" },
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("devrait échouer à récupérer le profil si le token est manquant", async () => {
    
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    await expect(getProfile()).rejects.toThrow("Token non disponible");
  });

  it("devrait réussir à enregistrer un utilisateur", async () => {
    const mockResponse = { data: { userId: 1, username: "user123" } };

    
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const username = "user123";
      const email = "user@test.com";
      const password = "test123";
    const role = "USER";

    const result = await registerUser(username, email, password, role);

    expect(axios.post).toHaveBeenCalledWith("http://localhost:6505/auth/register", {
      username, email, password, role
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("devrait échouer à enregistrer un utilisateur si des champs sont manquants", async () => {
    await expect(registerUser("", "", "", "")).rejects.toThrow("Tous les champs sont requis !");
  });

});
