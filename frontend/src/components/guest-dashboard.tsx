// components/guest-dashboard.tsx
import { Recipe } from "../App";
import {
  ChefHat,
  AlertTriangle,
  MessageCircle,
  Plus,
  Clock,
  Users,
  Star,
  BookOpen,
  LogIn,
  UserPlus,
} from "lucide-react";

interface GuestDashboardProps {
  onBackToChat: () => void;
  onContinueAsGuest: () => void;
  onLogin: () => void;
  onRegister: () => void;
  currentRecipes: Recipe[];
  hasActiveChat: boolean;
}

export function GuestDashboard({
  onBackToChat,
  onContinueAsGuest,
  onLogin,
  onRegister,
  currentRecipes,
  hasActiveChat,
}: GuestDashboardProps) {
  // Função para formatar o tempo de preparo
  const formatPrepTime = (prepTime: string) => {
    return prepTime.replace(" min", "");
  };

  // Função para obter cor baseada na dificuldade
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "fácil":
        return "text-green-600 bg-green-50 border-green-200";
      case "médio":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "difícil":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-4 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B35] rounded-full p-1.5">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[#343A40]">
            Modo Convidado
          </span>
        </div>
        <div className="w-6"></div> {/* Espaçamento para centralizar */}
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {/* Status da sessão */}
        <div className="bg-gradient-to-r from-[#FFF5F2] to-orange-50 rounded-xl mx-4 mt-4 p-4 border border-orange-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                hasActiveChat ? "bg-green-500 animate-pulse" : "bg-gray-300"
              }`}
            ></div>
            <div className="flex-1">
              <p className="text-[#343A40] font-medium">
                {hasActiveChat ? "Conversa Ativa" : "Nenhuma Conversa Ativa"}
              </p>
              <p className="text-sm text-[#6C757D]">
                {currentRecipes.length > 0
                  ? `${currentRecipes.length} receita(s) gerada(s)`
                  : "Nenhuma receita gerada ainda"}
              </p>
            </div>
          </div>
        </div>

        {/* Aviso importante no topo */}
        <div className="mx-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Modo Convidado - Dados Temporários
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Suas receitas e conversas são salvas apenas nesta sessão. Se
                você sair do aplicativo, todos os dados serão perdidos.
              </p>
            </div>
          </div>
        </div>

        {/* Ações principais */}
        <div className="mx-4 mt-6 space-y-3">
          {hasActiveChat && (
            <button
              onClick={onBackToChat}
              className="w-full touch-target p-4 bg-[#FF6B35] text-white rounded-xl text-left hover:bg-[#FF6B35]/90 transition-interactive flex items-center gap-3 group shadow-sm"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base">Continuar Conversa</p>
                <p className="text-sm text-white/90 mt-1">
                  Retome sua conversa atual com a IA
                </p>
              </div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </button>
          )}

          <button
            onClick={onContinueAsGuest}
            className="w-full touch-target p-4 bg-white text-[#343A40] rounded-xl text-left hover:bg-[#F8F9FA] transition-interactive border border-border flex items-center gap-3 group shadow-sm"
          >
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <p className="font-semibold text-base">Nova Receita</p>
              <p className="text-sm text-[#6C757D] mt-1">
                Começar uma nova conversa com a IA
              </p>
            </div>
          </button>
        </div>

        {/* Receitas salvas localmente */}
        {currentRecipes.length > 0 && (
          <div className="mx-4 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="text-lg font-semibold text-[#343A40]">
                Suas Receitas
              </h3>
              <span className="bg-[#FF6B35] text-white text-xs px-2 py-1 rounded-full">
                {currentRecipes.length}
              </span>
            </div>

            <div className="space-y-3">
              {currentRecipes.slice(0, 3).map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-[#FF6B35]/30 transition-colors group cursor-pointer shadow-sm"
                  onClick={() => {
                    // Aqui você pode adicionar uma função para abrir a receita
                    console.log("Abrir receita:", recipe.title);
                  }}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#343A40] truncate mb-1">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#6C757D]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatPrepTime(recipe.prepTime)}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{recipe.servings} porções</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(
                          recipe.difficulty
                        )}`}
                      >
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-4 h-4 text-[#FF6B35] fill-current" />
                  </div>
                </div>
              ))}

              {currentRecipes.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-[#6C757D]">
                    +{currentRecipes.length - 3} outra(s) receita(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA para criar conta */}
        <div className="mx-4 mt-8 pt-6 border-t border-border">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <p className="text-sm font-semibold text-[#343A40] mb-1">
              Não perca suas receitas!
            </p>
            <p className="text-xs text-[#6C757D] max-w-xs mx-auto">
              Crie uma conta gratuita para salvar suas receitas e conversas
              permanentemente
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onLogin}
              className="flex-1 touch-target p-3 bg-white border border-[#FF6B35] text-[#FF6B35] rounded-lg text-center hover:bg-[#FFF5F2] transition-interactive font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Fazer Login
            </button>
            <button
              onClick={onRegister}
              className="flex-1 touch-target p-3 bg-[#FF6B35] text-white rounded-lg text-center hover:bg-[#FF6B35]/90 transition-interactive font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        </div>

        {/* Aviso final */}
        <div className="mx-4 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-sm">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Dica Importante
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Suas receitas estão salvas apenas temporariamente. Recomendamos
                criar uma conta para acessar suas receitas de qualquer
                dispositivo.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
