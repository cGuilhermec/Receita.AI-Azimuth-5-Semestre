// hooks/useChat.ts
import { useState } from "react";
import { iaService, ChatResponse, RecipeResponse } from "../services/iaService";
import { useAuth } from "./useAuth"; // Importe o useAuth para verificar se está logado

interface UseChatReturn {
  isLoading: boolean;
  error: string | null;
  currentRecipe: RecipeResponse | null;
  chatId: string | null;
  sendToAI: (ingredients: string[], imageDataUrls: string[]) => Promise<void>;
  clearChat: () => void;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeResponse | null>(
    null
  );
  const [chatId, setChatId] = useState<string | null>(() => {
    // Tenta carregar o chatId do localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("receitaAi_chatId");
    }
    return null;
  });

  const { user } = useAuth(); // Verifica se o usuário está logado

  const sendToAI = async (ingredients: string[], imageDataUrls: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Determina se é convidado baseado na autenticação
      const isGuest = !user;

      const response = await iaService.sendToAI(
        ingredients,
        imageDataUrls,
        chatId || undefined,
        isGuest // Passa se é convidado ou não
      );

      // Salva o chatId no localStorage para continuar a conversa
      if (response.chatId && response.chatId !== chatId) {
        setChatId(response.chatId);
        if (typeof window !== "undefined") {
          localStorage.setItem("receitaAi_chatId", response.chatId);
        }
      }

      setCurrentRecipe(response.resposta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setCurrentRecipe(null);
    setChatId(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("receitaAi_chatId");
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    currentRecipe,
    chatId,
    sendToAI,
    clearChat,
    clearError,
  };
}
