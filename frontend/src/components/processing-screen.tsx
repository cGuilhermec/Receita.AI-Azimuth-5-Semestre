import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const loadingMessages = [
  'Analisando ingredientes...',
  'Identificando sabores e aromas...',
  'Aquecendo a IA culinária...',
  'Gerando receitas personalizadas...',
  'Combinando ingredientes...',
  'Quase pronto...',
];

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 10;
      });
    }, 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

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
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B35] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Cancel Button */}
        <Button
          variant="ghost"
          onClick={onComplete}
          className="text-[#6C757D] hover:text-[#343A40] mt-8"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}