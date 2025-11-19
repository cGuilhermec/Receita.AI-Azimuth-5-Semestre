import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Users,
  ChefHat,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  difficulty: string;
  cuisine: string;
  servings: number;
  ingredients?: string[];
  instructions?: string[];
}

interface ResultsScreenProps {
  onBack: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
  recipes: Recipe[];
  identifiedIngredients?: { name: string; confidence: number }[];
  isLoading?: boolean;
}

type SortOption = "relevance" | "time" | "difficulty";
type FilterDifficulty = "all" | "Fácil" | "Médio" | "Difícil";

export function ResultsScreen({
  onBack,
  onRecipeSelect,
  recipes,
  identifiedIngredients = [],
  isLoading = false,
}: ResultsScreenProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterDifficulty, setFilterDifficulty] =
    useState<FilterDifficulty>("all");

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-[#28A745]";
    if (confidence >= 60) return "bg-[#FFC107]";
    return "bg-[#DC3545]";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "Alta";
    if (confidence >= 60) return "Média";
    return "Baixa";
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = recipes
    .filter((recipe) => {
      if (filterDifficulty === "all") return true;
      return recipe.difficulty === filterDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        const timeA = parseInt(a.prepTime);
        const timeB = parseInt(b.prepTime);
        return timeA - timeB;
      }
      if (sortBy === "difficulty") {
        const difficultyOrder = { Fácil: 1, Médio: 2, Difícil: 3 };
        return (
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
      }
      return 0; // relevance (default order)
    });

  const getSortLabel = () => {
    if (sortBy === "time") return "Mais Rápida";
    if (sortBy === "difficulty") return "Dificuldade";
    return "Relevância";
  };

  // Função para obter imagem padrão se não houver imagem específica
  const getRecipeImage = (recipe: Recipe) => {
    if (recipe.image && recipe.image !== "default") {
      return recipe.image;
    }
    // Imagens padrão baseadas na culinária ou ingredientes
    const defaultImages = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

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
        <h2 className="text-lg text-[#343A40] flex-1">Suas Receitas</h2>

        {/* Filter and Sort Controls - Só mostra se tiver receitas */}
        {recipes.length > 0 && (
          <div className="flex gap-2">
            {/* Sort Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="touch-target h-10 px-3 flex items-center gap-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-interactive focus-ring"
                  aria-label="Ordenar receitas"
                >
                  <ArrowUpDown className="w-4 h-4 text-[#343A40]" />
                  <span className="text-sm text-[#343A40]">
                    {getSortLabel()}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Ordenar por</SheetTitle>
                </SheetHeader>
                <RadioGroup
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value as SortOption)}
                  className="py-4"
                >
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="relevance" id="relevance" />
                    <Label
                      htmlFor="relevance"
                      className="flex-1 cursor-pointer"
                    >
                      Relevância
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time" className="flex-1 cursor-pointer">
                      Tempo de Preparo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="difficulty" id="difficulty" />
                    <Label
                      htmlFor="difficulty"
                      className="flex-1 cursor-pointer"
                    >
                      Dificuldade
                    </Label>
                  </div>
                </RadioGroup>
              </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="touch-target w-10 h-10 flex items-center justify-center rounded-lg bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-interactive focus-ring relative"
                  aria-label="Filtrar receitas"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#343A40]" />
                  {filterDifficulty !== "all" && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6B35] rounded-full"></span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Filtrar por Dificuldade</SheetTitle>
                </SheetHeader>
                <RadioGroup
                  value={filterDifficulty}
                  onValueChange={(value: any) =>
                    setFilterDifficulty(value as FilterDifficulty)
                  }
                  className="py-4"
                >
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="flex-1 cursor-pointer">
                      Todas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="Fácil" id="easy" />
                    <Label htmlFor="easy" className="flex-1 cursor-pointer">
                      Fácil
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="Médio" id="medium" />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      Médio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3">
                    <RadioGroupItem value="Difícil" id="hard" />
                    <Label htmlFor="hard" className="flex-1 cursor-pointer">
                      Difícil
                    </Label>
                  </div>
                </RadioGroup>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Identified Ingredients */}
        {identifiedIngredients.length > 0 && (
          <section className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-[#343A40]">
                Ingredientes Identificados
              </h3>
              <button className="text-sm text-[#FF6B35] hover:underline transition-interactive focus-ring">
                Editar
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {identifiedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-[#F8F9FA] rounded-lg px-4 py-3 min-w-[140px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-[#6C757D]" />
                      <span className="text-sm text-[#343A40]">
                        {ingredient.name}
                      </span>
                    </div>
                    {ingredient.confidence > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          ingredient.confidence >= 80
                            ? "bg-[#28A745]/10 text-[#28A745]"
                            : ingredient.confidence >= 60
                            ? "bg-[#FFC107]/10 text-[#FFC107]"
                            : "bg-[#DC3545]/10 text-[#DC3545]"
                        }`}
                      >
                        {getConfidenceText(ingredient.confidence)}
                      </span>
                    )}
                  </div>
                  {ingredient.confidence > 0 && (
                    <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getConfidenceColor(
                          ingredient.confidence
                        )} transition-all duration-500`}
                        style={{ width: `${ingredient.confidence}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="px-6 pt-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-[#FFE5DC] border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-[#343A40] mb-2">
                Gerando suas receitas...
              </p>
              <p className="text-sm text-[#6C757D]">
                A IA está criando receitas personalizadas para você
              </p>
            </div>
          </section>
        )}

        {/* Recipes */}
        <section className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#343A40]">
              {recipes.length > 0
                ? "Suas Receitas Personalizadas"
                : isLoading
                ? "Gerando Receitas..."
                : "Nenhuma Receita Encontrada"}
            </h3>
            {recipes.length > 0 && (
              <span className="text-sm text-[#6C757D]">
                {filteredAndSortedRecipes.length} receita(s)
              </span>
            )}
          </div>

          {!isLoading && recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-[#6C757D] mx-auto mb-4 opacity-50" />
              <p className="text-[#6C757D] text-lg mb-2">
                Nenhuma receita gerada
              </p>
              <p className="text-sm text-[#6C757D] mb-6">
                Não foi possível criar receitas com os ingredientes fornecidos.
              </p>
              <Button
                onClick={onBack}
                className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
              >
                Voltar e Adicionar Mais Ingredientes
              </Button>
            </div>
          ) : !isLoading && filteredAndSortedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <SlidersHorizontal className="w-16 h-16 text-[#6C757D] mx-auto mb-4 opacity-50" />
              <p className="text-[#6C757D] text-lg mb-2">
                Nenhuma receita encontrada
              </p>
              <p className="text-sm text-[#6C757D] mb-6">
                Tente ajustar os filtros para ver mais receitas.
              </p>
              <Button
                onClick={() => {
                  setFilterDifficulty("all");
                  setSortBy("relevance");
                }}
                variant="outline"
                className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FFF5F2]"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onRecipeSelect(recipe)}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={getRecipeImage(recipe)}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg text-[#343A40] mb-2 font-medium">
                      {recipe.title}
                    </h4>
                    <p className="text-sm text-[#6C757D] line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.prepTime}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {recipe.servings} porções
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]"
                      >
                        {recipe.difficulty}
                      </Badge>
                      {recipe.cuisine && (
                        <Badge
                          variant="secondary"
                          className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]"
                        >
                          {recipe.cuisine}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label={
                          favorites.has(recipe.id)
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(recipe.id)
                              ? "fill-[#FF6B35] text-[#FF6B35]"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label="Comentários"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label="Compartilhar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Empty State com Sugestões */}
        {!isLoading && recipes.length === 0 && (
          <section className="px-6 pt-6">
            <div className="bg-[#FFF5F2] rounded-lg p-6 text-center">
              <h4 className="text-lg text-[#343A40] mb-2">
                Dicas para Melhores Resultados
              </h4>
              <ul className="text-sm text-[#6C757D] space-y-1 text-left max-w-md mx-auto">
                <li>
                  • Certifique-se de que os ingredientes estão bem iluminados
                  nas fotos
                </li>
                <li>
                  • Adicione múltiplos ingredientes para receitas mais variadas
                </li>
                <li>• Evite fotos com muitos ingredientes misturados</li>
                <li>• Foque em ingredientes frescos e bem visíveis</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
