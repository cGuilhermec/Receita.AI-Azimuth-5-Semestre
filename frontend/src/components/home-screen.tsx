// components/home-screen.tsx
import { ChefHat, User, Plus, X, BookOpen, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ImageCaptureArea } from "./image-capture-area";

interface HomeScreenProps {
  onCaptureImage: (imageDataUrl: string) => void;
  onCreateRecipes: () => void;
  onProfileClick: () => void;
  onMyRecipesClick: () => void; // ← NOVA PROP
}

interface IngredientItem {
  type: "image" | "manual";
  value: string;
}

export function HomeScreen({
  onCaptureImage,
  onCreateRecipes,
  onProfileClick,
  onMyRecipesClick,
}: HomeScreenProps) {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleImageCaptured = (imageDataUrl: string) => {
    setIngredients([...ingredients, { type: "image", value: imageDataUrl }]);
    onCaptureImage(imageDataUrl);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B35] rounded-full p-1.5">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-[#343A40]">Receita.Ai</span>
        </div>
        <button
          onClick={onProfileClick}
          className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
          aria-label="Perfil do usuário"
        >
          <User className="w-6 h-6 text-[#6C757D]" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-[140px]">
        <div className="px-6 pt-10 pb-8 text-center">
          <h1 className="text-3xl text-[#343A40] mb-3">
            O que vamos cozinhar hoje?
          </h1>
          <p className="text-[#6C757D] max-w-md mx-auto">
            Fotografe seus ingredientes e nossa IA criará receitas
            personalizadas para você.
          </p>
        </div>

        <ImageCaptureArea
          onImageCaptured={handleImageCaptured}
          showTutorial={showTutorial}
          onShowTutorialChange={setShowTutorial}
        />

        {ingredients.length > 0 && (
          <div className="px-6 mt-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={ingredient.value}
                    alt={`Ingrediente ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => removeIngredient(index)}
                    className="absolute -top-2 -right-2 touch-target w-7 h-7 bg-[#DC3545] rounded-full flex items-center justify-center shadow-md hover:bg-[#DC3545]/90 transition-interactive focus-ring"
                    aria-label={`Remover ingrediente ${index + 1}`}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute top-1 left-1 bg-[#343A40]/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Botão Principal - Criar Receitas */}
      <div className="fixed bottom-[76px] left-0 right-0 px-6 pb-4">
        <Button
          onClick={onCreateRecipes}
          disabled={ingredients.length === 0}
          className="w-full h-[52px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg shadow-lg flex items-center justify-center gap-2 transition-interactive disabled:bg-[#6C757D]/30 disabled:text-[#6C757D]/50 disabled:cursor-not-allowed disabled:shadow-none focus-ring"
          aria-label={
            ingredients.length === 0
              ? "Adicione ingredientes para criar receitas"
              : "Criar receitas"
          }
        >
          <ChefHat className="w-5 h-5" />
          CRIAR MINHAS RECEITAS
        </Button>
      </div>

      {/* Bottom Navigation Simplificada */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around items-center h-16 px-6">
          {/* Botão Home (Ativo) */}
          <button
            className="flex flex-col items-center gap-1 touch-target p-2 text-[#FF6B35] transition-interactive"
            aria-label="Início"
          >
            <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Início</span>
          </button>

          {/* Botão Minhas Receitas */}
          <button
            onClick={onMyRecipesClick}
            className="flex flex-col items-center gap-1 touch-target p-2 text-[#6C757D] hover:text-[#FF6B35] transition-interactive"
            aria-label="Minhas Receitas"
          >
            <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs">Minhas Receitas</span>
          </button>

          {/* Botão Perfil */}
          <button
            onClick={onProfileClick}
            className="flex flex-col items-center gap-1 touch-target p-2 text-[#6C757D] hover:text-[#FF6B35] transition-interactive"
            aria-label="Perfil"
          >
            <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
