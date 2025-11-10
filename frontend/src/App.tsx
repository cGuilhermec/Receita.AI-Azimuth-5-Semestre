import { useState } from 'react';
import { SplashScreen } from './components/splash-screen';
import { WelcomeScreen } from './components/welcome-screen';
import { RegistrationForm } from './components/registration-form';
import { HomeScreen } from './components/home-screen';
import { ProcessingScreen } from './components/processing-screen';
import { ResultsScreen } from './components/results-screen';
import { RecipeDetailScreen } from './components/recipe-detail-screen';
import { ChatOverlay } from './components/chat-overlay';
import { ProfileScreen } from './components/profile-screen';

type Screen = 'splash' | 'welcome' | 'registration' | 'home' | 'processing' | 'results' | 'recipe-detail' | 'profile';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSplashComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleWelcomeStart = () => {
    setCurrentScreen('home');
  };

  const handleWelcomeRegister = () => {
    setCurrentScreen('registration');
  };

  const handleRegistrationComplete = () => {
    setCurrentScreen('home');
  };

  const handleRegistrationSkip = () => {
    setCurrentScreen('home');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleCaptureImage = () => {
    // In a real app, this would open the camera
    console.log('Opening camera...');
  };

  const handleCreateRecipes = () => {
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentScreen('results');
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen('recipe-detail');
  };

  const handleBackToResults = () => {
    setCurrentScreen('results');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handleProfileClick = () => {
    setCurrentScreen('profile');
  };

  const handleBackToHomeFromProfile = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="size-full bg-white">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onStart={handleWelcomeStart}
          onRegister={handleWelcomeRegister}
        />
      )}

      {currentScreen === 'registration' && (
        <RegistrationForm
          onComplete={handleRegistrationComplete}
          onSkip={handleRegistrationSkip}
          onBack={handleBackToWelcome}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onCaptureImage={handleCaptureImage}
          onCreateRecipes={handleCreateRecipes}
          onProfileClick={handleProfileClick}
        />
      )}

      {currentScreen === 'processing' && (
        <ProcessingScreen onComplete={handleProcessingComplete} />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          onBack={handleBackToHome}
          onRecipeSelect={handleRecipeSelect}
        />
      )}

      {currentScreen === 'recipe-detail' && selectedRecipe && (
        <RecipeDetailScreen
          recipe={selectedRecipe}
          onBack={handleBackToResults}
          onOpenChat={handleOpenChat}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen onBack={handleBackToHomeFromProfile} />
      )}

      {showChat && <ChatOverlay onClose={handleCloseChat} />}
    </div>
  );
}