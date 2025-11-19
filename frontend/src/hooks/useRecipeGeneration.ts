// hooks/useRecipeGeneration.ts
import { useState } from "react";
import { useChat } from "./useChat";

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
}

export function useRecipeGeneration() {
  const { sendToAI, isLoading, error, currentRecipe } = useChat();
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipes = async (
    ingredients: string[],
    imageDataUrls: string[]
  ) => {
    setIsGenerating(true);
    try {
      await sendToAI(ingredients, imageDataUrls);

      // Quando a IA responde, convertemos a resposta em receitas
      if (currentRecipe && currentRecipe.isReceita) {
        const newRecipe: Recipe = {
          id: Date.now().toString(),
          title: currentRecipe.titulo || "Receita Personalizada",
          description: `Receita criada com ${ingredients.join(", ")}`,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop", // imagem padrão
          prepTime: "20 min",
          difficulty: "Médio",
          cuisine: "Personalizada",
          servings: 4,
          ingredients: currentRecipe.ingredientes || [],
          instructions: currentRecipe.modo_preparo
            ? [currentRecipe.modo_preparo]
            : [],
        };

        setGeneratedRecipes([newRecipe]);
      }
    } catch (err) {
      console.error("Erro ao gerar receitas:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateRecipes,
    generatedRecipes,
    isGenerating,
    isLoading,
    error,
  };
}
