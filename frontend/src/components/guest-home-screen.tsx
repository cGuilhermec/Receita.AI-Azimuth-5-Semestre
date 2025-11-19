// components/guest-home-screen.tsx
import { ChefHat, X, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ImageCaptureArea } from "./image-capture-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface GuestHomeScreenProps {
  onCaptureImage: (imageDataUrl: string) => void;
  onCreateRecipes: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

interface IngredientItem {
  type: "image" | "manual";
  value: string;
}

export function GuestHomeScreen({
  onCaptureImage,
  onCreateRecipes,
  onLogin,
  onRegister,
}: GuestHomeScreenProps) {
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

        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="touch-target px-4 py-2 text-[#FF6B35] hover:bg-[#FFF5F2] rounded-lg transition-interactive focus-ring text-sm"
          >
            Entrar
          </button>
          <button
            onClick={onRegister}
            className="touch-target px-4 py-2 bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 rounded-lg transition-interactive focus-ring text-sm"
          >
            Criar Conta
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-[140px]">
        <div className="px-6 pt-10 pb-8 text-center">
          <h1 className="text-3xl text-[#343A40] mb-3">
            O que vamos cozinhar hoje?
          </h1>
          <p className="text-[#6C757D] max-w-md mx-auto">
            Fotografe seus ingredientes e nossa IA criará receitas
            personalizadas para você.
          </p>

          <div className="mt-4 p-4 bg-[#FFF5F2] rounded-lg border border-[#FF6B35]/20">
            <p className="text-sm text-[#343A40]">
              💡 <strong>Modo Convidado:</strong> Use todas as funcionalidades!
              <button
                onClick={onRegister}
                className="ml-1 text-[#FF6B35] hover:underline font-medium"
              >
                Crie uma conta
              </button>{" "}
              para salvar suas receitas e preferências.
            </p>
          </div>
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-center items-center h-16 px-6">
          <p className="text-sm text-[#6C757D]">
            Quer salvar suas receitas?{" "}
            <button
              onClick={onRegister}
              className="text-[#FF6B35] hover:underline font-medium"
            >
              Crie uma conta gratuita
            </button>
          </p>
        </div>
      </div>

      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dicas de Captura</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Boa iluminação</p>
                <p className="text-sm text-[#6C757D]">
                  Certifique-se de ter luz suficiente para ver os ingredientes
                  claramente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Enquadramento</p>
                <p className="text-sm text-[#6C757D]">
                  Posicione os ingredientes no centro da foto, evitando sombras.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Separação</p>
                <p className="text-sm text-[#6C757D]">
                  Separe os ingredientes para facilitar a identificação.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowTutorial(false)}
              className="h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-interactive focus-ring"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
