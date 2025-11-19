// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from "react";
import { userService, User, LoginData } from "../services/userService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário já está logado ao carregar o app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      console.log("🔍 Checking auth status...");
      const userData = await userService.getCurrentUser();
      console.log("✅ Current user data:", userData);
      setUser(userData);
    } catch (err) {
      console.log("❌ No authenticated user or error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // hooks/useAuth.ts - versão corrigida
  const login = async (loginData: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Attempting login...");

      // 1. Faz login (só define o cookie)
      const result = await userService.login(loginData);
      console.log("✅ Login successful - response:", result);

      // 2. Busca os dados do usuário separadamente
      console.log("🔄 Fetching user data from /me...");
      const userData = await userService.getCurrentUser();
      console.log("👤 User data from /me:", userData);

      setUser(userData);
    } catch (err: any) {
      console.log("❌ Login error:", err);
      const message =
        err.response?.data?.message || err.message || "Erro ao fazer login";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      await userService.logout();
      console.log("✅ Logout successful");
    } catch (err) {
      console.error("❌ Erro ao fazer logout:", err);
    } finally {
      setUser(null);
      console.log("🔄 User state cleared");
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
