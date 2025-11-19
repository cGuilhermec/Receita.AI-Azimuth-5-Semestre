// components/my-recipes-screen.tsx
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Users,
  Trash2,
  Plus,
  Star,
  Share2,
  Bookmark,
  BookmarkCheck,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface Recipe {
  _id: string;
  titulo: string;
  ingredientes: string[];
  modo_preparo: string;
  data: string;
  image?: string;
  prepTime?: string;
  difficulty?: string;
  servings?: number;
  isReceita: boolean;
}

interface MyRecipesScreenProps {
  onBack: () => void;
  onCreateNew: () => void;
}

export function MyRecipesScreen({ onBack, onCreateNew }: MyRecipesScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());

  // Buscar receitas do usuário
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:3005/recipes/my-recipes",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar receitas");
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err: any) {
        console.error("Erro ao buscar receitas:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Deletar receita
  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/recipes/${recipeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir receita");
      }

      // Remove a receita da lista local
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
      if (selectedRecipe?._id === recipeId) {
        setSelectedRecipe(null);
      }
    } catch (err: any) {
      console.error("Erro ao excluir receita:", err);
      alert("Erro ao excluir receita");
    }
  };

  // Alternar receita salva
  const toggleSavedRecipe = (recipeId: string) => {
    setSavedRecipes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  // Função para obter imagem padrão baseada nos ingredientes
  const getRecipeImage = (ingredients: string[]): string => {
    const ingLower = ingredients.map((ing) => ing.toLowerCase());

    if (
      ingLower.some(
        (ing) =>
          ing.includes("salada") ||
          ing.includes("alface") ||
          ing.includes("tomate") ||
          ing.includes("rúcula")
      )
    ) {
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop";
    }
    if (
      ingLower.some(
        (ing) =>
          ing.includes("pão") ||
          ing.includes("sanduíche") ||
          ing.includes("hambúrguer") ||
          ing.includes("lanche")
      )
    ) {
      return "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=300&fit=crop";
    }
    if (
      ingLower.some(
        (ing) =>
          ing.includes("sopa") ||
          ing.includes("caldo") ||
          ing.includes("creme") ||
          ing.includes("ensopado")
      )
    ) {
      return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop";
    }
    if (
      ingLower.some(
        (ing) =>
          ing.includes("frango") ||
          ing.includes("carne") ||
          ing.includes("peixe") ||
          ing.includes("bife")
      )
    ) {
      return "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop";
    }
    if (
      ingLower.some(
        (ing) =>
          ing.includes("doce") ||
          ing.includes("sobremesa") ||
          ing.includes("bolo") ||
          ing.includes("chocolate")
      )
    ) {
      return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop";
    }

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
  };

  // Função para calcular tempo de preparo estimado
  const estimatePrepTime = (modoPreparo: string): string => {
    const stepCount = modoPreparo
      .split(/\.|\n/)
      .filter((step) => step.trim().length > 0).length;
    if (stepCount <= 3) return "15 min";
    if (stepCount <= 6) return "30 min";
    return "45 min";
  };

  // Função para determinar dificuldade
  const estimateDifficulty = (
    ingredients: string[],
    modoPreparo: string
  ): string => {
    const ingCount = ingredients.length;
    const stepCount = modoPreparo
      .split(/\.|\n/)
      .filter((step) => step.trim().length > 0).length;

    if (ingCount <= 3 && stepCount <= 3) return "Fácil";
    if (ingCount <= 6 && stepCount <= 6) return "Médio";
    return "Difícil";
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        <Header onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-[#FF6B35] animate-pulse" />
            </div>
            <p className="text-[#6C757D]">Carregando suas receitas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        <Header onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#DC3545] mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <Header onBack={onBack} />

      <main className="flex-1 overflow-y-auto pb-20">
        {/* Cabeçalho */}
        <div className="px-6 py-6 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#343A40]">
                  Minhas Receitas
                </h1>
                <p className="text-[#6C757D] text-sm">
                  {recipes.length} receita(s) criada(s) com IA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Receitas */}
        <div className="p-4 max-w-4xl mx-auto">
          {recipes.length === 0 ? (
            <EmptyState onCreateNew={onCreateNew} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onView={() => setSelectedRecipe(recipe)}
                  onDelete={() => handleDeleteRecipe(recipe._id)}
                  onSave={() => toggleSavedRecipe(recipe._id)}
                  isSaved={savedRecipes.has(recipe._id)}
                  getImage={getRecipeImage}
                  estimateTime={estimatePrepTime}
                  estimateDifficulty={estimateDifficulty}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Visualização da Receita */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isSaved={savedRecipes.has(selectedRecipe._id)}
          onSave={() => toggleSavedRecipe(selectedRecipe._id)}
          onClose={() => setSelectedRecipe(null)}
          onDelete={() => {
            handleDeleteRecipe(selectedRecipe._id);
            setSelectedRecipe(null);
          }}
          getImage={getRecipeImage}
          estimateTime={estimatePrepTime}
          estimateDifficulty={estimateDifficulty}
        />
      )}

      {/* Botão Flutuante para Nova Receita */}
      {recipes.length > 0 && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button
            onClick={onCreateNew}
            className="w-14 h-14 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Criar nova receita"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente de Header
function Header({ onBack }: { onBack: () => void }) {
  return (
    <header className="h-[60px] flex items-center gap-4 px-4 border-b border-border bg-white">
      <button
        onClick={onBack}
        className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-6 h-6 text-[#343A40]" />
      </button>
      <div className="flex-1">
        <h2 className="text-lg text-[#343A40]">Minhas Receitas</h2>
      </div>
    </header>
  );
}

// Estado Vazio
function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ChefHat className="w-10 h-10 text-[#FF6B35]" />
      </div>
      <h3 className="text-xl font-bold text-[#343A40] mb-3">
        Nenhuma receita salva
      </h3>
      <p className="text-[#6C757D] text-sm mb-8 max-w-md mx-auto">
        Crie receitas incríveis com a ajuda da nossa IA. Basta descrever seus
        ingredientes e deixe a magia acontecer!
      </p>
      <Button
        onClick={onCreateNew}
        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 px-8 py-3 rounded-xl font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        Criar Primeira Receita
      </Button>
    </div>
  );
}

// Componente de Card de Receita
function RecipeCard({
  recipe,
  onView,
  onDelete,
  onSave,
  isSaved,
  getImage,
  estimateTime,
  estimateDifficulty,
}: {
  recipe: Recipe;
  onView: () => void;
  onDelete: () => void;
  onSave: () => void;
  isSaved: boolean;
  getImage: (ingredients: string[]) => string;
  estimateTime: (modoPreparo: string) => string;
  estimateDifficulty: (ingredients: string[], modoPreparo: string) => string;
}) {
  const imageUrl = recipe.image || getImage(recipe.ingredientes);
  const prepTime = recipe.prepTime || estimateTime(recipe.modo_preparo);
  const difficulty =
    recipe.difficulty ||
    estimateDifficulty(recipe.ingredientes, recipe.modo_preparo);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={imageUrl}
          alt={recipe.titulo}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className="absolute top-3 right-3 touch-target w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          aria-label={isSaved ? "Remover dos favoritos" : "Salvar receita"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-[#FF6B35]" fill="#FF6B35" />
          ) : (
            <Bookmark className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-[#343A40] text-lg leading-tight line-clamp-2 flex-1">
            {recipe.titulo}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#6C757D] mb-3">
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{prepTime}</span>
          </div>
          <div
            className={`px-2 py-1 rounded-full font-medium ${
              difficulty === "Fácil"
                ? "bg-green-50 text-green-700"
                : difficulty === "Médio"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {difficulty}
          </div>
        </div>

        <p className="text-sm text-[#6C757D] line-clamp-2 mb-4">
          {recipe.ingredientes.slice(0, 4).join(", ")}
          {recipe.ingredientes.length > 4 && "..."}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={onView}
            className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Ver Receita
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="touch-target w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            aria-label="Excluir receita"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Visualização Completa da Receita - VERSÃO CORRIGIDA
function RecipeModal({
  recipe,
  isSaved,
  onSave,
  onClose,
  onDelete,
  getImage,
  estimateTime,
  estimateDifficulty,
}: {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
  onClose: () => void;
  onDelete: () => void;
  getImage: (ingredients: string[]) => string;
  estimateTime: (modoPreparo: string) => string;
  estimateDifficulty: (ingredients: string[], modoPreparo: string) => string;
}) {
  const imageUrl = recipe.image || getImage(recipe.ingredientes);
  const prepTime = recipe.prepTime || estimateTime(recipe.modo_preparo);
  const difficulty =
    recipe.difficulty ||
    estimateDifficulty(recipe.ingredientes, recipe.modo_preparo);

  // Prevenir scroll do body quando modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Função para fechar modal ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col mx-auto">
        {/* Header do Modal com botões fixos */}
        <div className="relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={recipe.titulo}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 touch-target w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onSave}
              className="touch-target w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label={isSaved ? "Remover dos favoritos" : "Salvar receita"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Bookmark className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={onDelete}
              className="touch-target w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Excluir receita"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Conteúdo da Receita com scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Informações principais */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#343A40] mb-3">
                {recipe.titulo}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-[#6C757D]">
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{prepTime}</span>
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    difficulty === "Fácil"
                      ? "bg-green-100 text-green-800"
                      : difficulty === "Médio"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <Star className="w-3 h-3" />
                  {difficulty}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {recipe.servings || 2} porções
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#343A40] mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
                Ingredientes
              </h3>
              <div className="bg-orange-50 rounded-xl p-4">
                <ul className="grid gap-2">
                  {recipe.ingredientes.map((ingrediente, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#343A40]"
                    >
                      <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-2"></div>
                      <span className="leading-relaxed">{ingrediente}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modo de Preparo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#343A40] mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
                Modo de Preparo
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-4">
                  {recipe.modo_preparo
                    .split(/\n|\. /)
                    .filter((step) => step.trim())
                    .map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-[#343A40] leading-relaxed flex-1">
                          {step.trim()}
                          {!step.endsWith(".") && !step.endsWith("!") && "."}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Data de Criação */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-[#6C757D] text-center">
                Receita criada em{" "}
                {new Date(recipe.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Botão de fechar no mobile */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 sm:hidden">
          <Button
            onClick={onClose}
            className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-3 rounded-xl font-semibold"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
