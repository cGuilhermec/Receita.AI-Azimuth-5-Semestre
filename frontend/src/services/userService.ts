// services/userService.ts
import { api } from "../components/api/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  lactose_intolerant?: boolean;
  high_cholesterol?: boolean;
  diabetes?: boolean;
  hypertension?: boolean;
  allergies?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export const userService = {
  async createUser(userData: any) {
    const response = await api.post("/user", userData);
    return response.data;
  },

  async getUserById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await api.post("/login", loginData, {
      withCredentials: true, // Isso permite enviar/receber cookies automaticamente
    });
    return response.data;
  },

  // Buscar perfil completo do usuário
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get("/profile", {
      withCredentials: true,
    });
    return response.data;
  },

  // Atualizar perfil do usuário
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put("/profile", profileData, {
      withCredentials: true,
    });
    return response.data;
  },

  // services/userService.ts - ajuste o getCurrentUser
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/me", {
        withCredentials: true,
      });

      // A estrutura é: { message, id, name, email } - não tem propriedade "user"
      if (response.data && response.data.id) {
        // Retorna os dados diretamente, pois estão na raiz do objeto
        const userData: User = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        };
        return userData;
      } else {
        console.error("❌ Unexpected /me response structure:", response.data);
        throw new Error("Estrutura de resposta inesperada do endpoint /me");
      }
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      throw error;
    }
  },

  async logout() {
    const response = await api.post(
      "/logout",
      {},
      {
        withCredentials: true, // Isso envia os cookies para o logout
      }
    );
    return response.data;
  },
};
