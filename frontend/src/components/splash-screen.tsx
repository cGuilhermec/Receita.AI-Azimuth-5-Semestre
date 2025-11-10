import { ChefHat } from 'lucide-react';
import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FFE5DC] to-white flex flex-col items-center justify-center z-50">
      <div className="animate-fade-in flex flex-col items-center gap-4">
        <div className="bg-[#FF6B35] rounded-full p-6 shadow-lg">
          <ChefHat className="w-16 h-16 text-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl text-[#343A40] tracking-tight">Receita.Ai</h1>
          <p className="text-[#6C757D]">Receitas Inteligentes com IA</p>
        </div>
      </div>
      <div className="absolute bottom-8 flex justify-center">
        <div className="animate-pulse w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}