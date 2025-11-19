// components/recipe-detail-screen.tsx - ATUALIZADO
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  ChefHat,
  Users,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ExitConfirmationModal } from "./exit-confirmation-modal";
import { useAuth } from "../hooks/useAuth";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  difficulty: string;
  cuisine: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  chatId?: string;
}

interface RecipeDetailScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onOpenChat: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function RecipeDetailScreen({
  recipe,
  onBack,
  onOpenChat,
  onLogin,
  onRegister,
}: RecipeDetailScreenProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [showExitModal, setShowExitModal] = useState(false);
  const { user } = useAuth();

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Função para lidar com o botão de voltar
  const handleBackClick = () => {
    // Se é usuário logado, volta normalmente
    if (user) {
      onBack();
    } else {
      // Se é convidado, mostra modal de confirmação
      setShowExitModal(true);
    }
  };

  // Função para confirmar saída
  const handleConfirmExit = () => {
    setShowExitModal(false);
    onBack();
  };

  // Função para cancelar saída
  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  // Função para calcular tempo de cozimento baseado na dificuldade
  const getCookingTime = () => {
    switch (recipe.difficulty?.toLowerCase()) {
      case "fácil":
        return "10 min";
      case "médio":
        return "20 min";
      case "difícil":
        return "30 min";
      default:
        return "15 min";
    }
  };

  // Função para determinar número de estrelas baseado na dificuldade
  const getDifficultyStars = () => {
    switch (recipe.difficulty?.toLowerCase()) {
      case "fácil":
        return 1;
      case "médio":
        return 2;
      case "difícil":
        return 3;
      default:
        return 2;
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-4 border-b border-border bg-white z-10">
        <button
          onClick={handleBackClick} // ← AGORA USA handleBackClick
          className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-[#343A40]" />
        </button>
        <h2 className="flex-1 text-center text-lg text-[#343A40] line-clamp-1 px-4">
          {recipe.title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "fill-[#FF6B35] text-[#FF6B35]" : "text-[#6C757D]"
              }`}
            />
          </button>
          <button
            className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
            aria-label="Compartilhar receita"
          >
            <Share2 className="w-6 h-6 text-[#6C757D]" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Hero Image */}
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Aviso para convidados */}
        {!user && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium">
                Modo Convidado - Receita não salva
              </p>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Crie uma conta para salvar esta receita permanentemente
            </p>
          </div>
        )}

        {/* Description */}
        {recipe.description && (
          <div className="px-6 py-4 border-b border-border">
            <p className="text-[#6C757D] text-sm leading-relaxed">
              {recipe.description}
            </p>
          </div>
        )}

        {/* Recipe Info */}
        <div className="px-6 py-4 grid grid-cols-4 gap-4 border-b border-border">
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-xs text-[#6C757D]">Preparo</span>
            <span className="text-sm text-[#343A40]">{recipe.prepTime}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ChefHat className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-xs text-[#6C757D]">Cozimento</span>
            <span className="text-sm text-[#343A40]">{getCookingTime()}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-xs text-[#6C757D]">Porções</span>
            <span className="text-sm text-[#343A40]">{recipe.servings}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex">
              {Array.from({ length: getDifficultyStars() }).map((_, index) => (
                <svg
                  key={index}
                  className="w-4 h-4 text-[#FF6B35] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-[#6C757D]">Dificuldade</span>
            <span className="text-sm text-[#343A40]">{recipe.difficulty}</span>
          </div>
        </div>

        {/* Ingredients */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-lg text-[#343A40] mb-4">Ingredientes</h3>
          <div className="space-y-3">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Checkbox
                    checked={checkedIngredients.has(index)}
                    onCheckedChange={() => toggleIngredient(index)}
                    className="mt-0.5"
                  />
                  <span
                    className={`text-[#343A40] ${
                      checkedIngredients.has(index)
                        ? "line-through text-[#6C757D]"
                        : ""
                    }`}
                  >
                    {ingredient}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#6C757D] text-sm">
                Nenhum ingrediente listado
              </p>
            )}
          </div>
        </section>

        {/* Instructions */}
        <section className="px-6 py-6">
          <h3 className="text-lg text-[#343A40] mb-4">Modo de Preparo</h3>
          <div className="space-y-4">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{index + 1}</span>
                  </div>
                  <p className="flex-1 text-[#343A40] pt-1 leading-relaxed">
                    {instruction}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#6C757D] text-sm">
                Modo de preparo não disponível
              </p>
            )}
          </div>
        </section>

        {/* Chat Info (se veio do chat) */}
        {recipe.chatId && (
          <div className="px-6 py-4 border-t border-border bg-[#FFF5F2]">
            <p className="text-xs text-[#FF6B35] text-center">
              📝 Receita gerada por IA - Use o chat para modificar
            </p>
          </div>
        )}
      </main>

      {/* Call to Action para convidados */}
      {!user && (
        <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-[#FF6B35] to-orange-500 rounded-xl p-4 text-white shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Não perca esta receita!</p>
              <p className="text-sm opacity-90">Crie uma conta para salvar</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onLogin}
                variant="outline"
                className="text-[#FF6B35] bg-white hover:bg-white/90 border-white"
                size="sm"
              >
                Login
              </Button>
              <Button
                onClick={onRegister}
                className="bg-white text-[#FF6B35] hover:bg-white/90 border-white"
                size="sm"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={onOpenChat}
        className="fixed bottom-6 right-6 touch-target w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center hover:bg-[#FF6B35]/90 transition-all hover:scale-110 focus-ring z-20"
        aria-label="Continuar conversa no chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Modal de Confirmação de Saída */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  );
}
