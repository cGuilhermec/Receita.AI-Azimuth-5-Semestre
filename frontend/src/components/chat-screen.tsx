// components/chat-screen.tsx - VERSÃO COMPLETA CORRIGIDA
import { ArrowLeft, Send, ChefHat, User, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRecipeChat } from "../hooks/useRecipeChat";

interface ChatScreenProps {
  onBack: () => void;
  onRecipeGenerated: (recipe: any, chatId?: string) => void;
  initialIngredients: string[];
  initialImages: string[];
}

const suggestions = [
  "Tenho tomate e cebola",
  "Tenho apenas esses ingredientes",
  "Quero uma receita simples",
  "Tenho mais temperos",
  "Pode sugerir com o que tenho",
];

export function ChatScreen({
  onBack,
  onRecipeGenerated,
  initialIngredients,
  initialImages,
}: ChatScreenProps) {
  // ✅ 1. TODOS OS HOOKS NO TOPO
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialIngredients = useRef(false);
  const previousImagesCount = useRef(initialImages.length);

  // ✅ 2. HOOK CUSTOMIZADO
  const { isLoading, conversation, sendMessage, hasRecipe, chatId } =
    useRecipeChat();

  // ✅ 3. useEffect CORRIGIDO - Detecta quando novas imagens são adicionadas
  useEffect(() => {
    console.log("🔍 useEffect - Verificando imagens:", {
      currentImages: initialImages.length,
      previousImages: previousImagesCount.current,
      hasSent: hasSentInitialIngredients.current,
      hasConversation: conversation.length > 0,
    });

    // ✅ CORREÇÃO: Se o número de imagens aumentou, reseta o flag
    if (initialImages.length > previousImagesCount.current) {
      console.log("🆕 Novas imagens detectadas! Resetando flag de envio.");
      hasSentInitialIngredients.current = false;
    }

    // ✅ Atualiza o contador anterior
    previousImagesCount.current = initialImages.length;

    const sendInitialIngredients = async () => {
      console.log("🔍 Verificando envio automático (convidado):", {
        hasImages: initialImages.length > 0,
        hasConversation: conversation.length > 0,
        alreadySent: hasSentInitialIngredients.current,
      });

      // ✅ CORREÇÃO: Só envia se tiver imagens, conversa estiver vazia e ainda não enviou
      if (
        initialImages.length > 0 &&
        conversation.length === 0 &&
        !hasSentInitialIngredients.current
      ) {
        try {
          console.log(
            "🚀 Enviando imagens automaticamente para IA (convidado)"
          );
          hasSentInitialIngredients.current = true;
          await sendMessage([], initialImages, "");
          console.log("✅ Imagens enviadas com sucesso!");
        } catch (error) {
          console.error("❌ Erro ao enviar ingredientes iniciais:", error);
          hasSentInitialIngredients.current = false;
        }
      } else {
        console.log("⏭️ Condições não atendidas para envio automático:", {
          hasImages: initialImages.length > 0,
          conversationEmpty: conversation.length === 0,
          notSent: !hasSentInitialIngredients.current,
        });
      }
    };

    const timer = setTimeout(sendInitialIngredients, 100);
    return () => clearTimeout(timer);
  }, [initialImages.length, conversation.length, initialImages]);

  // ✅ 4. useEffect PARA SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // ✅ 5. FUNÇÕES HANDLER
  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim()) return;

    setInputValue("");

    try {
      await sendMessage([], [], messageToSend);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInputValue("");

    try {
      await sendMessage([], [], suggestion);
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
    }
  };

  // ✅ 6. Função para forçar reanálise de imagens
  const handleReanalyzeImages = async () => {
    console.log("🔄 Forçando reanálise das imagens");
    hasSentInitialIngredients.current = false;
    previousImagesCount.current = initialImages.length;

    try {
      await sendMessage([], initialImages, "Analise estas imagens novamente");
    } catch (error) {
      console.error("Erro ao reanalisar imagens:", error);
    }
  };

  // ✅ 7. RENDER
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center gap-4 px-4 border-b border-border">
        <button
          onClick={onBack}
          className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-[#343A40]" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg text-[#343A40]">Assistente Culinário</h2>
          <p className="text-sm text-[#6C757D]">
            Ajudo a criar receitas com seus ingredientes
          </p>
        </div>

        {/* ✅ BOTÃO PARA REANALISAR IMAGENS */}
        {conversation.length > 0 && initialImages.length > 0 && !isLoading && (
          <button
            onClick={handleReanalyzeImages}
            disabled={isLoading}
            className="touch-target px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            aria-label="Reanalisar imagens"
          >
            <RefreshCw className="w-4 h-4" />
            Reanalisar
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {conversation.length === 0 && isLoading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-6 h-6 text-[#FF6B35] animate-pulse" />
            </div>
            <p className="text-[#6C757D] mb-2">
              Analisando seus ingredientes...
            </p>
            <p className="text-xs text-[#6C757D]">
              Isso pode levar alguns segundos
            </p>
          </div>
        )}

        {conversation.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <ChefHat className="w-12 h-12 text-[#6C757D] mx-auto mb-4 opacity-50" />
            <p className="text-[#6C757D] mb-4">
              Preparando para analisar seus ingredientes...
            </p>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  console.log("🔄 Fallback manual - convidado");
                  hasSentInitialIngredients.current = false;
                  try {
                    await sendMessage(
                      initialIngredients.length > 0
                        ? initialIngredients
                        : ["Tomate", "Cebola", "Alface"],
                      initialImages,
                      "Analise estes ingredientes e crie receitas"
                    );
                  } catch (error) {
                    console.error("Erro no fallback:", error);
                  }
                }}
                className="touch-target px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm hover:bg-[#FF6B35]/90 transition-colors"
              >
                Iniciar Análise Manualmente
              </button>

              {/* ✅ INFO SOBRE AS IMAGENS */}
              {initialImages.length > 0 && (
                <p className="text-xs text-blue-600">
                  📷 {initialImages.length} imagem(ns) pronta(s) para análise
                </p>
              )}
            </div>
          </div>
        )}

        {conversation.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === "user" ? "bg-[#4ECDC4]" : "bg-[#FF6B35]"
              }`}
            >
              {message.sender === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <ChefHat className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[75%] ${
                message.sender === "user" ? "items-end" : "items-start"
              } flex flex-col gap-1`}
            >
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-[#4ECDC4] text-white rounded-br-none"
                    : "bg-[#F8F9FA] text-[#343A40] rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>

                {message.type === "recipe" && message.recipe && (
                  <div className="mt-3 pt-3 border-t border-gray-200/50">
                    {/* CARD DA RECEITA */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                      {/* CABEÇALHO */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#343A40] text-base">
                            {message.recipe.titulo}
                          </h4>
                          <p className="text-xs text-[#6C757D] mt-1">
                            💡 Dica: Faça login para salvar suas receitas
                          </p>
                        </div>
                      </div>

                      {/* INGREDIENTES */}
                      {message.recipe.ingredientes &&
                        message.recipe.ingredientes.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-[#343A40] text-sm mb-2 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full"></div>
                              Ingredientes
                            </h5>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <ul className="space-y-1.5">
                                {message.recipe.ingredientes.map(
                                  (ingrediente: any, index: any) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-[#343A40]"
                                    >
                                      <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full opacity-60 flex-shrink-0"></div>
                                      <span>{ingrediente}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        )}

                      {/* MODO DE PREPARO */}
                      {message.recipe.modo_preparo && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-[#343A40] text-sm mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full"></div>
                            Modo de Preparo
                          </h5>
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <p className="text-sm text-[#343A40] leading-relaxed whitespace-pre-line">
                              {message.recipe.modo_preparo}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* BOTÃO */}
                      <Button
                        onClick={() => {
                          console.log(
                            "🖱️ CLICOU - Receita (convidado):",
                            message.recipe
                          );
                          onRecipeGenerated(
                            message.recipe,
                            chatId || undefined
                          );
                        }}
                        className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
                      >
                        <ChefHat className="w-4 h-4 mr-2" />
                        Abrir Receita Completa
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs text-[#6C757D] px-2">
                {message.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="bg-[#F8F9FA] rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {conversation.length > 0 && !isLoading && !hasRecipe && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex-shrink-0 touch-target px-4 py-2 bg-[#F8F9FA] hover:bg-[#FF6B35] hover:text-white text-[#343A40] rounded-full text-sm transition-interactive focus-ring"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) {
              handleSendMessage();
            }
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Descreva seus ingredientes ou peça uma receita..."
            className="flex-1 rounded-lg border-[#6C757D]/30"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="touch-target w-10 h-10 p-0 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-lg flex-shrink-0 transition-interactive disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            aria-label="Enviar mensagem"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
