import { ArrowLeft, Heart, Share2, Clock, ChefHat, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

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

interface RecipeDetailScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onOpenChat: () => void;
}

const mockIngredients = [
  '2 tomates maduros grandes',
  '1 pepino médio',
  '1/2 cebola roxa',
  '100g de queijo feta',
  '2 colheres de sopa de azeite de oliva',
  '1 colher de sopa de vinagre balsâmico',
  'Sal e pimenta a gosto',
  'Folhas de manjericão fresco',
];

const mockInstructions = [
  'Lave bem todos os vegetais em água corrente.',
  'Corte os tomates em cubos médios e coloque em uma tigela grande.',
  'Descasque e corte o pepino em rodelas finas.',
  'Corte a cebola roxa em fatias bem finas.',
  'Adicione o queijo feta cortado em cubos à tigela.',
  'Em uma tigela pequena, misture o azeite, vinagre, sal e pimenta.',
  'Despeje o molho sobre a salada e misture delicadamente.',
  'Decore com folhas de manjericão fresco e sirva imediatamente.',
];

export function RecipeDetailScreen({ recipe, onBack, onOpenChat }: RecipeDetailScreenProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

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

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-4 border-b border-border bg-white z-10">
        <button
          onClick={onBack}
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
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-[#6C757D]'
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
            <span className="text-sm text-[#343A40]">10 min</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-xs text-[#6C757D]">Porções</span>
            <span className="text-sm text-[#343A40]">{recipe.servings}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex">
              {[1, 2, 3].map((star) => (
                <svg
                  key={star}
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
            {mockIngredients.map((ingredient, index) => (
              <div key={index} className="flex items-start gap-3">
                <Checkbox
                  checked={checkedIngredients.has(index)}
                  onCheckedChange={() => toggleIngredient(index)}
                  className="mt-0.5"
                />
                <span
                  className={`text-[#343A40] ${
                    checkedIngredients.has(index) ? 'line-through text-[#6C757D]' : ''
                  }`}
                >
                  {ingredient}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="px-6 py-6">
          <h3 className="text-lg text-[#343A40] mb-4">Modo de Preparo</h3>
          <div className="space-y-4">
            {mockInstructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{index + 1}</span>
                </div>
                <p className="flex-1 text-[#343A40] pt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={onOpenChat}
        className="fixed bottom-6 right-6 touch-target w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center hover:bg-[#FF6B35]/90 transition-all hover:scale-110 focus-ring z-20"
        aria-label="Abrir chat de modificações"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}