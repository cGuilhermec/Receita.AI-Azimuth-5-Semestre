// components/processing-screen.tsx
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRecipeGeneration } from "../hooks/useRecipeGeneration";

interface ProcessingScreenProps {
  onComplete: (recipes: any[]) => void;
  ingredients: string[];
  imageDataUrls: string[];
}

const loadingMessages = [
  "Analisando ingredientes...",
  "Identificando sabores e aromas...",
  "Consultando a IA culinária...",
  "Gerando receitas personalizadas...",
  "Combinando ingredientes...",
  "Quase pronto...",
];

export function ProcessingScreen({
  onComplete,
  ingredients,
  imageDataUrls,
}: ProcessingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { generateRecipes, generatedRecipes, isGenerating } =
    useRecipeGeneration();

  useEffect(() => {
    // Inicia a geração de receitas assim que o componente monta
    if (ingredients.length > 0) {
      generateRecipes(ingredients, imageDataUrls);
    }

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2; // Progresso mais lento para IA real
      });
    }, 200);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, [ingredients, imageDataUrls, generateRecipes]);

  // Quando as receitas forem geradas, chama onComplete
  useEffect(() => {
    if (generatedRecipes.length > 0 && !isGenerating) {
      setTimeout(() => {
        onComplete(generatedRecipes);
      }, 1000);
    }
  }, [generatedRecipes, isGenerating, onComplete]);

  const handleCancel = () => {
    // Poderia adicionar lógica para cancelar a requisição da IA
    onComplete([]);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-[#FFF5F2] flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        {/* Animated Loader */}
        <div className="relative">
          <div className="w-24 h-24 border-8 border-[#FFE5DC] border-t-[#FF6B35] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-xl text-[#343A40] animate-pulse">
            {loadingMessages[messageIndex]}
          </p>
          {isGenerating && (
            <p className="text-sm text-[#6C757D]">
              Gerando receitas com {ingredients.length} ingredientes...
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B35] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#6C757D] text-center mt-2">
            {progress}% completo
          </p>
        </div>

        {/* Cancel Button */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="text-[#6C757D] hover:text-[#343A40] mt-8"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
