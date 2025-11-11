// hooks/useUserRegistration.ts
import { useState } from "react";
import { userService } from "../services/userService";

export function useUserRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await userService.createUser(userData);
      return result;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Erro ao criar usuário";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
    error,
  };
}
