// hooks/useRecipeChat.ts - CORREÇÃO COMPLETA
import { useState, useCallback, useEffect } from "react";
import { iaService, RecipeResponse } from "../services/iaService";
import { useAuth } from "./useAuth";

interface ConversationMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "message" | "recipe";
  recipe?: RecipeResponse;
}

export function useRecipeChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const { user } = useAuth();

  // ✅ CORREÇÃO: Chave do localStorage baseada no usuário logado
  const getStorageKey = useCallback(
    (suffix: string) => {
      if (user) {
        return `receitaAi_${user.id}_${suffix}`; // Conversa específica do usuário
      }
      return `receitaAi_guest_${suffix}`; // Conversa de convidado
    },
    [user]
  );

  // ✅ CORREÇÃO: Carregar conversa em um useEffect separado
  useEffect(() => {
    const storageKey = getStorageKey("conversation");
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log(
          `💾 Conversa recuperada (${user ? "usuário" : "convidado"}):`,
          parsed.length,
          "mensagens"
        );
        setConversation(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (error) {
        console.error("Erro ao recuperar conversa:", error);
        setConversation([]);
      }
    }

    const chatIdKey = getStorageKey("chatId");
    const savedChatId = localStorage.getItem(chatIdKey);
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, [getStorageKey, user]); // Recarrega quando o usuário muda

  const saveConversation = useCallback(
    (newConversation: ConversationMessage[]) => {
      try {
        const storageKey = getStorageKey("conversation");
        localStorage.setItem(storageKey, JSON.stringify(newConversation));
        console.log(
          `💾 Conversa salva (${user ? "usuário" : "convidado"}):`,
          newConversation.length,
          "mensagens"
        );
      } catch (error) {
        console.error("Erro ao salvar conversa:", error);
      }
    },
    [getStorageKey, user]
  );

  const sendMessage = useCallback(
    async (
      ingredients: string[],
      imageDataUrls: string[],
      userMessage?: string
    ) => {
      setIsLoading(true);
      setError(null);

      let currentConversation = [...conversation];

      try {
        if (userMessage && userMessage.trim()) {
          console.log("👤 Adicionando mensagem do usuário:", userMessage);

          const userMsg: ConversationMessage = {
            id: `user-${Date.now()}-${Math.random()}`,
            text: userMessage,
            sender: "user",
            timestamp: new Date(),
            type: "message",
          };

          currentConversation = [...currentConversation, userMsg];
          setConversation(currentConversation);
          saveConversation(currentConversation);
        }

        const isGuest = !user;

        console.log("📤 Enviando para IA:", {
          userMessage,
          ingredients: ingredients.length,
          imageDataUrls: imageDataUrls.length,
          chatId,
          currentConversationLength: currentConversation.length,
          user: user ? `logado (${user.id})` : "convidado",
        });

        const response = await iaService.sendToAI(
          ingredients || [],
          imageDataUrls || [],
          userMessage,
          chatId || undefined,
          isGuest
        );

        console.log("🤖 Resposta da IA recebida");

        if (response.chatId && response.chatId !== chatId) {
          setChatId(response.chatId);
          const chatIdKey = getStorageKey("chatId");
          localStorage.setItem(chatIdKey, response.chatId);
        }

        const aiMessage: ConversationMessage = {
          id: `ai-${Date.now()}-${Math.random()}`,
          text: response.resposta.mensagem || "Analisando seus ingredientes...",
          sender: "ai",
          timestamp: new Date(),
          type: response.resposta.isReceita ? "recipe" : "message",
          recipe: response.resposta.isReceita ? response.resposta : undefined,
        };

        const finalConversation = [...currentConversation, aiMessage];
        setConversation(finalConversation);
        saveConversation(finalConversation);

        return response.resposta;
      } catch (err: any) {
        console.error("❌ Erro no useRecipeChat:", err);
        const errorMsg = err.message || "Erro ao processar sua solicitação";
        setError(errorMsg);

        const errorMessage: ConversationMessage = {
          id: `error-${Date.now()}-${Math.random()}`,
          text: `Erro: ${errorMsg}`,
          sender: "ai",
          timestamp: new Date(),
          type: "message",
        };

        const errorConversation = [...currentConversation, errorMessage];
        setConversation(errorConversation);
        saveConversation(errorConversation);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [chatId, user, conversation, saveConversation, getStorageKey]
  );

  const clearConversation = useCallback(() => {
    console.log(`🗑️ Limpando conversa (${user ? "usuário" : "convidado"})`);
    setConversation([]);
    setChatId(null);

    const chatIdKey = getStorageKey("chatId");
    const conversationKey = getStorageKey("conversation");

    localStorage.removeItem(chatIdKey);
    localStorage.removeItem(conversationKey);
  }, [getStorageKey, user]);

  const addUserMessage = useCallback(
    (text: string) => {
      console.log(
        "👤 Adicionando mensagem do usuário via addUserMessage:",
        text
      );
      const userMsg: ConversationMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        text,
        sender: "user",
        timestamp: new Date(),
        type: "message",
      };
      const newConversation = [...conversation, userMsg];
      setConversation(newConversation);
      saveConversation(newConversation);
    },
    [conversation, saveConversation]
  );

  return {
    isLoading,
    error,
    conversation,
    chatId,
    sendMessage,
    clearConversation,
    addUserMessage,
    hasRecipe: conversation.some((msg) => msg.type === "recipe"),
  };
}
