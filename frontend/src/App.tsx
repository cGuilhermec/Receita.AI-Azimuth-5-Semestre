// App.tsx
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { SplashScreen } from "./components/splash-screen";
import { WelcomeScreen } from "./components/welcome-screen";
import { LoginScreen } from "./components/login-screen";
import { RegistrationForm } from "./components/registration-form";
import { HomeScreen } from "./components/home-screen";
import { ProcessingScreen } from "./components/processing-screen";
import { ResultsScreen } from "./components/results-screen";
import { RecipeDetailScreen } from "./components/recipe-detail-screen";
import { ChatOverlay } from "./components/chat-overlay";
import { ProfileScreen } from "./components/profile-screen";
import { GuestHomeScreen } from "./components/guest-home-screen";

import { GuestDashboard } from "./components/guest-dashboard";
import { MyRecipesScreen } from "./components/my-recipes-screen";
import { ChatScreenLogged } from "./components/chat-screen-logged";
import { ChatScreen } from "./components/chat-screen";

type Screen =
  | "splash"
  | "welcome"
  | "registration"
  | "login"
  | "home"
  | "processing"
  | "results"
  | "recipe-detail"
  | "guest-home"
  | "profile"
  | "guest-processing"
  | "guest-results"
  | "guest-dashboard"
  | "chat"
  | "my-recipes";

export interface Recipe {
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

interface IngredientItem {
  type: "image" | "manual";
  value: string;
}

// Componente principal que usa autenticação
function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [capturedIngredients, setCapturedIngredients] = useState<
    { name: string; confidence: number }[]
  >([]);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [guestIngredients, setGuestIngredients] = useState<IngredientItem[]>(
    []
  );
  const [chatGeneratedRecipe, setChatGeneratedRecipe] = useState<Recipe | null>(
    null
  );
  const [guestRecipes, setGuestRecipes] = useState<Recipe[]>([]);
  const [guestChatId, setGuestChatId] = useState<string | null>(null);

  // Função para abrir o chat REAL (não o overlay)
  const handleOpenChatFromRecipe = () => {
    // Se temos um chatId ativo (do guest), vamos para a tela de chat
    if (guestChatId) {
      setCurrentScreen("chat");
    }
    // Se é um usuário logado com receita do chat, também vai para o chat
    else if (selectedRecipe?.chatId) {
      setCurrentScreen("chat");
    }
    // Caso contrário, inicia um novo chat
    else {
      setCurrentScreen("chat");
    }
  };

  // Função para voltar do chat para a receita
  const handleBackFromChatToRecipe = () => {
    setCurrentScreen("recipe-detail");
  };

  // Função quando receita é gerada para convidado
  const handleGuestRecipeGenerated = (recipeData: any, chatId?: string) => {
    const recipe = convertIARecipeToAppRecipe(recipeData, chatId || "");
    setGuestRecipes((prev) => [...prev, recipe]);
    setSelectedRecipe(recipe);
    setCurrentScreen("recipe-detail");

    if (chatId) {
      setGuestChatId(chatId);
      localStorage.setItem("guestChatId", chatId);
    }
  };

  // Função para sair do chat
  const handleBackFromChat = () => {
    console.log("🔙 handleBackFromChat chamado:", {
      user: !!user,
      selectedRecipe: !!selectedRecipe,
      guestRecipesCount: guestRecipes.length,
      guestChatId: guestChatId,
      currentScreen: currentScreen,
    });

    // ✅ USUÁRIO LOGADO: Sempre volta para HomeScreen
    if (user) {
      console.log("👤 USUÁRIO LOGADO - Voltando para HOME");
      setCurrentScreen("home");
      return;
    }

    // ✅ CONVIDADO: Lógica existente
    // Se tem uma receita selecionada (ex: clicou em "Ver Receita" mas voltou)
    if (selectedRecipe) {
      console.log("👤 CONVIDADO - Voltando para recipe-detail");
      setCurrentScreen("recipe-detail");
    }
    // Se tem receitas geradas ou chat ativo, vai para o dashboard
    else if (guestRecipes.length > 0 || guestChatId) {
      console.log("👤 CONVIDADO - Voltando para guest-dashboard");
      setCurrentScreen("guest-dashboard");
    }
    // Caso contrário, volta para capturar mais ingredientes
    else {
      console.log("👤 CONVIDADO - Voltando para guest-home");
      setCurrentScreen("guest-home");
    }
  };

  const convertIARecipeToAppRecipe = (
    iaRecipe: any,
    chatId: string
  ): Recipe => {
    return {
      id: chatId || Date.now().toString(),
      title: iaRecipe.titulo || "Receita Personalizada",
      description: `Receita criada pela IA com ${
        iaRecipe.ingredientes?.length || 0
      } ingredientes`,
      image: getRecipeImageByIngredients(iaRecipe.ingredientes || []),
      prepTime: calculatePrepTime(iaRecipe.modo_preparo),
      difficulty: "Médio", // Poderia analisar a complexidade do modo_preparo
      cuisine: "Personalizada",
      servings: 4,
      ingredients: iaRecipe.ingredientes || [],
      instructions: iaRecipe.modo_preparo
        ? [iaRecipe.modo_preparo]
        : ["Modo de preparo não disponível"],
      chatId: chatId,
    };
  };

  // Função auxiliar para escolher imagem baseada nos ingredientes
  const getRecipeImageByIngredients = (ingredients: string[]): string => {
    const hasSalad = ingredients.some((ing) =>
      ["alface", "tomate", "cebola", "salada"].includes(ing.toLowerCase())
    );
    const hasSandwich = ingredients.some((ing) =>
      ["pão", "hambúrguer", "sanduíche"].includes(ing.toLowerCase())
    );
    const hasSoup = ingredients.some((ing) =>
      ["sopa", "caldo", "creme"].includes(ing.toLowerCase())
    );

    if (hasSalad)
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop";
    if (hasSandwich)
      return "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=800&h=600&fit=crop";
    if (hasSoup)
      return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop";

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
  };

  // Função para estimar tempo de preparo
  const calculatePrepTime = (instructions: string): string => {
    if (!instructions) return "15 min";
    const wordCount = instructions.split(" ").length;
    if (wordCount < 50) return "15 min";
    if (wordCount < 100) return "30 min";
    return "45 min";
  };

  // No App.tsx - FUNÇÃO COMPLETA E CORRIGIDA
  const handleRecipeGenerated = (recipeData: any, chatId?: string) => {
    console.log("📝 Receita gerada:", recipeData);
    console.log("💬 ChatId:", chatId);

    // Função para escolher imagem baseada nos ingredientes
    const getRecipeImageByIngredients = (ingredients: string[]): string => {
      const ingLower = ingredients.map((ing) => ing.toLowerCase());

      if (
        ingLower.some(
          (ing) =>
            ing.includes("salada") ||
            ing.includes("alface") ||
            ing.includes("tomate") ||
            ing.includes("cebola")
        )
      ) {
        return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop";
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
        return "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=800&h=600&fit=crop";
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
        return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop";
      }
      if (
        ingLower.some(
          (ing) =>
            ing.includes("massa") ||
            ing.includes("macarrão") ||
            ing.includes("espaguete") ||
            ing.includes("lasanha")
        )
      ) {
        return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop";
      }

      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
    };

    // Função para estimar tempo de preparo
    const calculatePrepTime = (modoPreparo: string): string => {
      if (!modoPreparo) return "15 min";
      const stepCount = modoPreparo
        .split(/\.|\n/)
        .filter((step) => step.trim().length > 0).length;
      if (stepCount <= 3) return "15 min";
      if (stepCount <= 6) return "30 min";
      return "45 min";
    };

    // Função para determinar dificuldade
    const determineDifficulty = (
      ingredients: string[],
      modoPreparo: string
    ): string => {
      if (ingredients.length <= 3 && modoPreparo.length < 200) return "Fácil";
      if (ingredients.length <= 6 && modoPreparo.length < 400) return "Médio";
      return "Difícil";
    };

    // Converte a resposta da IA para o formato Recipe
    const recipe: Recipe = {
      id: chatId || Date.now().toString(), // Usa chatId como ID se disponível
      title: recipeData.titulo || "Receita Personalizada",
      description: `Receita criada com ${
        recipeData.ingredientes?.length || 0
      } ingredientes`,
      image: getRecipeImageByIngredients(recipeData.ingredientes || []),
      prepTime: calculatePrepTime(recipeData.modo_preparo),
      difficulty: determineDifficulty(
        recipeData.ingredientes || [],
        recipeData.modo_preparo || ""
      ),
      cuisine: "Personalizada",
      servings: 4,
      ingredients: recipeData.ingredientes || [],
      instructions: recipeData.modo_preparo
        ? recipeData.modo_preparo
            .split(/\.|\n/)
            .filter((step: string) => step.trim().length > 0)
        : ["Modo de preparo não disponível"],
      chatId: chatId, // Salva o chatId para referência futura
    };

    console.log("🍳 Recipe convertida:", recipe);

    // Define a receita selecionada e vai para a tela de detalhes
    setSelectedRecipe(recipe);
    setCurrentScreen("recipe-detail");
  };

  // DEBUG: Monitorar mudanças no estado de autenticação
  useEffect(() => {
    console.log("🔄 Auth state changed:", {
      user,
      authLoading,
      currentScreen,
      hasUser: !!user,
      userId: user?.id,
    });
  }, [user, authLoading, currentScreen]);

  // Redirecionamentos automáticos baseados no estado de autenticação
  useEffect(() => {
    if (authLoading) {
      console.log("⏳ Auth still loading...");
      return;
    }

    console.log("🎯 Checking redirects...", { user, currentScreen });

    if (user) {
      // Usuário está logado - redireciona para home se estiver em telas de auth
      if (
        [
          "welcome",
          "login",
          "registration",
          "guest-home",
          "guest-processing",
          "guest-results",
        ].includes(currentScreen)
      ) {
        console.log("🚀 User logged in, redirecting to home");
        setCurrentScreen("home");
      }
    } else {
      // Usuário não está logado - redireciona para welcome apenas se estiver em telas protegidas
      // MAS permite ficar nas telas de convidado
      const protectedScreens = ["home", "profile", "processing", "results"]; // Telas que exigem login
      const guestScreens = [
        "guest-home",
        "guest-processing",
        "guest-results",
        "recipe-detail",
      ]; // Telas permitidas para convidados

      if (protectedScreens.includes(currentScreen)) {
        console.log("🔙 User not logged in, redirecting to welcome");
        setCurrentScreen("welcome");
      }
      // Se está em uma tela de convidado e faz login, redireciona para home
      else if (guestScreens.includes(currentScreen) && user) {
        console.log("🔙 Guest became user, redirecting to home");
        setCurrentScreen("home");
      }
    }
  }, [user, authLoading, currentScreen]);

  // Se ainda está carregando a autenticação, mostra splash
  if (authLoading && currentScreen !== "splash") {
    return <SplashScreen onComplete={() => {}} />;
  }

  const handleSplashComplete = () => {
    // Se usuário já está logado, vai direto para home
    if (user) {
      setCurrentScreen("home");
    } else {
      setCurrentScreen("welcome");
    }
  };

  // Funções de navegação principais
  const handleWelcomeStart = () => {
    setCurrentScreen("guest-home");
  };

  const handleWelcomeRegister = () => {
    setCurrentScreen("registration");
  };

  const handleWelcomeLogin = () => {
    setCurrentScreen("login");
  };

  const handleRegistrationComplete = () => {
    setCurrentScreen("home");
  };

  const handleRegistrationSkip = () => {
    setCurrentScreen("guest-home");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
  };

  const handleLoginSuccess = () => {
    console.log("Login success - navigating to home");
    setCurrentScreen("home");
  };

  const handleBackFromLogin = () => {
    setCurrentScreen("welcome");
  };

  const handleLoginToRegister = () => {
    setCurrentScreen("registration");
  };

  // Funções para captura de ingredientes
  const handleCaptureImage = (imageDataUrl: string) => {
    console.log("Image captured:", imageDataUrl);
    // Simula detecção de ingredientes - na implementação real viria da IA
    const detectedIngredients = [
      { name: "Tomate", confidence: 92 },
      { name: "Cebola", confidence: 85 },
      { name: "Alface", confidence: 78 },
    ];

    setCapturedImages((prev) => [...prev, imageDataUrl]);
    setCapturedIngredients((prev) => [...prev, ...detectedIngredients]);
  };

  const handleGuestImageCaptured = (imageDataUrl: string) => {
    console.log("Guest image captured:", imageDataUrl);
    setGuestIngredients((prev) => [
      ...prev,
      { type: "image", value: imageDataUrl },
    ]);
  };

  // Funções para criação de receitas
  // App.tsx - CORRIJA ESTA FUNÇÃO
  const handleCreateRecipes = () => {
    console.log("🍳 handleCreateRecipes chamado:", {
      user: !!user,
      userType: user ? "logado" : "convidado",
      images: capturedImages.length,
    });

    if (user) {
      // ✅ USUÁRIO LOGADO: Vai direto para o CHAT
      console.log("👤 USUÁRIO LOGADO - Indo para CHAT");
      setCurrentScreen("chat");
    } else {
      // ✅ CONVIDADO: Vai para guest-processing
      console.log("👤 CONVIDADO - Indo para GUEST-PROCESSING");
      setCurrentScreen("guest-processing");
    }
  };

  const handleGuestCreateRecipes = () => {
    console.log("🍳 handleGuestCreateRecipes chamado:", {
      guestIngredients: guestIngredients.length,
      capturedIngredients: capturedIngredients.length,
      capturedImages: capturedImages.length,
    });

    // Se não tem ingredientes, mostra aviso
    if (guestIngredients.length === 0) {
      console.log("❌ Nenhuma imagem adicionada");
      // Pode mostrar um alerta para o usuário
      return;
    }

    localStorage.removeItem("receitaAi_conversation");
    localStorage.removeItem("receitaAi_chatId");

    const imagesToSend = guestIngredients
      .filter((i) => i.type === "image")
      .map((i) => i.value);

    console.log("🚀 Indo para o chat com:", {
      images: imagesToSend.length,
      guestIngredientsCount: guestIngredients.length,
    });

    // Vai para o chat - a IA vai analisar as imagens automaticamente
    setCurrentScreen("chat");
  };

  // Funções de processamento completado
  const handleProcessingComplete = (recipes: Recipe[]) => {
    console.log("Processing complete with recipes:", recipes);
    setGeneratedRecipes(recipes);

    if (user) {
      setCurrentScreen("results");
    } else {
      setCurrentScreen("guest-results");
    }
  };

  const handleGuestProcessingComplete = (recipes: Recipe[]) => {
    console.log("Guest processing complete with recipes:", recipes);
    setGeneratedRecipes(recipes);
    setCurrentScreen("guest-results");
  };

  // Funções de seleção de receitas
  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen("recipe-detail");
  };

  // Funções de navegação de volta
  const handleBackToResults = () => {
    if (user) {
      setCurrentScreen("results");
    } else {
      setCurrentScreen("guest-results");
    }
  };

  const handleBackToHome = () => {
    if (user) {
      setCurrentScreen("home");
    } else {
      setCurrentScreen("guest-home");
    }
  };

  const handleBackToGuestHome = () => {
    setCurrentScreen("guest-home");
  };

  // Funções de chat
  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Funções de perfil
  const handleProfileClick = () => {
    setCurrentScreen("profile");
  };

  const handleBackToHomeFromProfile = () => {
    setCurrentScreen("home");
  };

  // Funções para convidados
  const handleGuestStart = () => {
    setCurrentScreen("guest-home");
  };

  const handleGuestToLogin = () => {
    setCurrentScreen("login");
  };

  const handleGuestToRegister = () => {
    setCurrentScreen("registration");
  };

  // Função para remover ingrediente do guest
  const handleRemoveGuestIngredient = (index: number) => {
    setGuestIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Simular geração de receitas (substituir pela IA real)
  const simulateRecipeGeneration = (): Recipe[] => {
    const baseRecipes: Recipe[] = [
      {
        id: "1",
        title: "Salada Mediterrânea Fresca",
        description:
          "Uma salada leve e refrescante com os ingredientes que você tem disponível, perfeita para o verão.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        prepTime: "15 min",
        difficulty: "Fácil",
        cuisine: "Mediterrânea",
        servings: 2,
        ingredients: [
          "2 tomates maduros grandes",
          "1 cebola roxa média",
          "1 pepino (se disponível)",
          "Azeite de oliva",
          "Vinagre balsâmico",
          "Sal e pimenta a gosto",
        ],
        instructions: [
          "Lave e corte os tomates em cubos",
          "Fatie a cebola roxa finamente",
          "Misture todos os ingredientes em uma tigela",
          "Tempere com azeite, vinagre, sal e pimenta",
          "Sirva fresco",
        ],
      },
      {
        id: "2",
        title: "Sanduíche Natural Colorido",
        description:
          "Um sanduíche saudável e rápido usando seus ingredientes frescos.",
        image:
          "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=800&h=600&fit=crop",
        prepTime: "10 min",
        difficulty: "Fácil",
        cuisine: "Caseira",
        servings: 1,
        ingredients: [
          "Pão de sua preferência",
          "Tomates em fatias",
          "Folhas de alface",
          "Cebola em rodelas finas",
          "Maionese ou azeite",
          "Temperos a gosto",
        ],
        instructions: [
          "Corte o pão ao meio",
          "Espalhe a maionese ou azeite",
          "Monte as camadas de alface, tomate e cebola",
          "Tempere a gosto",
          "Feche o sanduíche e sirva",
        ],
      },
    ];

    return baseRecipes;
  };

  // Função para obter ingredientes para o ProcessingScreen
  const getIngredientsForProcessing = (): string[] => {
    return capturedIngredients.map((ing) => ing.name);
  };

  return (
    <div className="size-full bg-white">
      {currentScreen === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === "welcome" && (
        <WelcomeScreen
          onStart={handleGuestStart}
          onRegister={handleWelcomeRegister}
          onLogin={handleWelcomeLogin}
        />
      )}

      {currentScreen === "guest-home" && (
        <GuestHomeScreen
          onCaptureImage={handleGuestImageCaptured}
          onCreateRecipes={handleGuestCreateRecipes}
          onLogin={handleGuestToLogin}
          onRegister={handleGuestToRegister}
        />
      )}

      {currentScreen === "login" && (
        <LoginScreen
          onBack={handleBackFromLogin}
          onLoginSuccess={handleLoginSuccess}
          onRegister={handleLoginToRegister}
        />
      )}

      {currentScreen === "registration" && (
        <RegistrationForm
          onComplete={handleRegistrationComplete}
          onSkip={handleRegistrationSkip}
          onBack={handleBackToWelcome}
        />
      )}

      {currentScreen === "home" && user && (
        <HomeScreen
          onCaptureImage={handleCaptureImage}
          onCreateRecipes={handleCreateRecipes}
          onProfileClick={handleProfileClick}
          onMyRecipesClick={() => setCurrentScreen("my-recipes")} // ← NOVA FUNÇÃO
        />
      )}

      {currentScreen === "my-recipes" && user && (
        <MyRecipesScreen
          onBack={() => setCurrentScreen("home")}
          onCreateNew={() => setCurrentScreen("home")} // Volta para home para criar nova
        />
      )}

      {/* PROCESSAMENTO PARA CONVIDADOS */}
      {currentScreen === "guest-processing" && !user && (
        <ProcessingScreen
          onComplete={handleGuestProcessingComplete}
          ingredients={getIngredientsForProcessing()}
          imageDataUrls={guestIngredients
            .filter((i) => i.type === "image")
            .map((i) => i.value)}
        />
      )}

      {/* RESULTADOS PARA USUÁRIOS LOGADOS */}
      {currentScreen === "results" && user && (
        <ResultsScreen
          onBack={handleBackToHome}
          onRecipeSelect={(recipe: any) => handleRecipeSelect(recipe)}
          recipes={generatedRecipes}
          identifiedIngredients={capturedIngredients}
        />
      )}

      {/* RESULTADOS PARA CONVIDADOS */}
      {currentScreen === "guest-results" && !user && (
        <ResultsScreen
          onBack={handleBackToGuestHome}
          onRecipeSelect={(recipe: any) => handleRecipeSelect(recipe)}
          recipes={generatedRecipes}
          identifiedIngredients={capturedIngredients}
        />
      )}

      {currentScreen === "recipe-detail" && selectedRecipe && (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          onBack={handleBackToResults}
          onOpenChat={handleOpenChatFromRecipe}
          onLogin={handleGuestToLogin} // ← ADICIONE
          onRegister={handleGuestToRegister} // ← ADICIONE
        />
      )}

      {currentScreen === "profile" && user && (
        <ProfileScreen onBack={handleBackToHomeFromProfile} />
      )}
      {currentScreen === "chat" && !user && (
        <ChatScreen
          onBack={handleBackFromChat} // ← USE A NOVA FUNÇÃO
          onRecipeGenerated={handleGuestRecipeGenerated}
          initialIngredients={[]}
          initialImages={guestIngredients
            .filter((i) => i.type === "image")
            .map((i) => i.value)}
        />
      )}

      {currentScreen === "chat" &&
        user && ( // ← NOVO: CHAT PARA USUÁRIO LOGADO
          <ChatScreenLogged
            onBack={handleBackFromChat}
            onRecipeGenerated={handleRecipeGenerated}
            initialIngredients={[]}
            initialImages={capturedImages}
          />
        )}

      {currentScreen === "guest-dashboard" && !user && (
        <GuestDashboard
          onBackToChat={() => setCurrentScreen("chat")}
          onContinueAsGuest={() => {
            // Limpa o estado atual e começa nova conversa
            setGuestRecipes([]);
            setGuestChatId(null);
            localStorage.removeItem("guestChatId");
            setCurrentScreen("guest-home");
          }}
          onLogin={handleGuestToLogin}
          onRegister={handleGuestToRegister}
          currentRecipes={guestRecipes}
          hasActiveChat={!!guestChatId}
        />
      )}

      {showChat && <ChatOverlay onClose={handleCloseChat} />}
    </div>
  );
}

// Componente principal que envolve com AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
