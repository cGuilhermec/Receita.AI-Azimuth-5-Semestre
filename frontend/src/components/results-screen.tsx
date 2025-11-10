import { ArrowLeft, Heart, MessageCircle, Share2, Clock, Users, ChefHat, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  difficulty: string;
  cuisine: string;
  servings: number;
}

interface ResultsScreenProps {
  onBack: () => void;
  onRecipeSelect: (recipe: Recipe) => void;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Salada Mediterrânea Fresca',
    description: 'Uma salada leve e refrescante com tomates, pepino e queijo feta, perfeita para o verão.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    prepTime: '15 min',
    difficulty: 'Fácil',
    cuisine: 'Mediterrânea',
    servings: 2,
  },
  {
    id: '2',
    title: 'Bruschetta de Tomate',
    description: 'Aperitivo clássico italiano com tomates frescos, manjericão e alho sobre pão crocante.',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&h=600&fit=crop',
    prepTime: '20 min',
    difficulty: 'Fácil',
    cuisine: 'Italiana',
    servings: 4,
  },
  {
    id: '3',
    title: 'Sopa de Tomate Caseira',
    description: 'Sopa cremosa e reconfortante, ideal para dias frios, com toque de manjericão.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    prepTime: '30 min',
    difficulty: 'Médio',
    cuisine: 'Caseira',
    servings: 4,
  },
];

const mockIngredients = [
  { name: 'Tomates', confidence: 95 },
  { name: 'Pepino', confidence: 88 },
  { name: 'Alface', confidence: 75 },
  { name: 'Cebola', confidence: 82 },
];

type SortOption = 'relevance' | 'time' | 'difficulty';
type FilterDifficulty = 'all' | 'Fácil' | 'Médio' | 'Difícil';

export function ResultsScreen({ onBack, onRecipeSelect }: ResultsScreenProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all');

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
    if (confidence >= 80) return 'bg-[#28A745]';
    if (confidence >= 60) return 'bg-[#FFC107]';
    return 'bg-[#DC3545]';
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = mockRecipes
    .filter((recipe) => {
      if (filterDifficulty === 'all') return true;
      return recipe.difficulty === filterDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'time') {
        const timeA = parseInt(a.prepTime);
        const timeB = parseInt(b.prepTime);
        return timeA - timeB;
      }
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Fácil': 1, 'Médio': 2, 'Difícil': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
      return 0; // relevance (default order)
    });

  const getSortLabel = () => {
    if (sortBy === 'time') return 'Mais Rápida';
    if (sortBy === 'difficulty') return 'Dificuldade';
    return 'Relevância';
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
        
        {/* Filter and Sort Controls */}
        <div className="flex gap-2">
          {/* Sort Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="touch-target h-10 px-3 flex items-center gap-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-interactive focus-ring"
                aria-label="Ordenar receitas"
              >
                <ArrowUpDown className="w-4 h-4 text-[#343A40]" />
                <span className="text-sm text-[#343A40]">{getSortLabel()}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Ordenar por</SheetTitle>
              </SheetHeader>
              <RadioGroup value={sortBy} onValueChange={(value: any) => setSortBy(value as SortOption)} className="py-4">
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="relevance" id="relevance" />
                  <Label htmlFor="relevance" className="flex-1 cursor-pointer">Relevância</Label>
                </div>
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="time" id="time" />
                  <Label htmlFor="time" className="flex-1 cursor-pointer">Tempo de Preparo</Label>
                </div>
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="difficulty" id="difficulty" />
                  <Label htmlFor="difficulty" className="flex-1 cursor-pointer">Dificuldade</Label>
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
                {filterDifficulty !== 'all' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6B35] rounded-full"></span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Filtrar por Dificuldade</SheetTitle>
              </SheetHeader>
              <RadioGroup value={filterDifficulty} onValueChange={(value:any) => setFilterDifficulty(value as FilterDifficulty)} className="py-4">
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">Todas</Label>
                </div>
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="Fácil" id="easy" />
                  <Label htmlFor="easy" className="flex-1 cursor-pointer">Fácil</Label>
                </div>
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="Médio" id="medium" />
                  <Label htmlFor="medium" className="flex-1 cursor-pointer">Médio</Label>
                </div>
                <div className="flex items-center space-x-3 py-3">
                  <RadioGroupItem value="Difícil" id="hard" />
                  <Label htmlFor="hard" className="flex-1 cursor-pointer">Difícil</Label>
                </div>
              </RadioGroup>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Identified Ingredients */}
        <section className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#343A40]">Ingredientes Identificados</h3>
            <button className="text-sm text-[#FF6B35] hover:underline transition-interactive focus-ring">
              Editar
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-[#F8F9FA] rounded-lg px-4 py-3 min-w-[140px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="w-4 h-4 text-[#6C757D]" />
                  <span className="text-sm text-[#343A40]">{ingredient.name}</span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getConfidenceColor(ingredient.confidence)}`}
                    style={{ width: `${ingredient.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recipes */}
        <section className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#343A40]">Suas Receitas Personalizadas</h3>
            <span className="text-sm text-[#6C757D]">{filteredAndSortedRecipes.length} receita(s)</span>
          </div>
          <div className="space-y-4">
            {filteredAndSortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div
                  onClick={() => onRecipeSelect(recipe)}
                  className="cursor-pointer"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg text-[#343A40] mb-2">{recipe.title}</h4>
                    <p className="text-sm text-[#6C757D] line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]">
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.prepTime}
                      </Badge>
                      <Badge variant="secondary" className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]">
                        <Users className="w-3 h-3 mr-1" />
                        {recipe.servings} porções
                      </Badge>
                      <Badge variant="secondary" className="bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F8F9FA]">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 pt-2 border-t border-border">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label={favorites.has(recipe.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(recipe.id)
                              ? 'fill-[#FF6B35] text-[#FF6B35]'
                              : ''
                          }`}
                        />
                      </button>
                      <button 
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label="Comentários"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button 
                        className="touch-target flex items-center justify-center gap-1 text-sm text-[#6C757D] hover:text-[#FF6B35] transition-interactive focus-ring"
                        aria-label="Compartilhar"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}