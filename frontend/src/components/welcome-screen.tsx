import { ChefHat } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
  onRegister: () => void;
}

export function WelcomeScreen({ onStart, onRegister }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-safe">
      <div className="min-h-screen flex flex-col p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12 pt-8">
          <div className="bg-[#FF6B35] rounded-full p-2">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl text-[#343A40]">Receita.Ai</span>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center gap-8 max-w-md mx-auto w-full">
          <div className="text-center space-y-4">
            <h1 className="text-3xl text-[#343A40]">Bem-vindo ao Receita.Ai!</h1>
            <p className="text-[#6C757D]">
              Vamos transformar seus ingredientes em receitas incríveis.
            </p>
          </div>

          {/* Decorative Illustration */}
          <div className="flex justify-center items-center gap-4 py-8">
            <div className="bg-[#F8F9FA] rounded-full p-4">
              <ChefHat className="w-12 h-12 text-[#FF6B35]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={onRegister}
              className="w-full h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg transition-interactive focus-ring"
            >
              Criar Conta
            </Button>

            <Button
              variant="outline"
              className="w-full h-[44px] bg-white border-[#6C757D]/30 text-[#343A40] rounded-lg hover:bg-[#F8F9FA] transition-interactive focus-ring"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-[44px] bg-[#000000] border-[#000000] text-white rounded-lg hover:bg-[#000000]/90 transition-interactive focus-ring"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Entrar com Apple
            </Button>

            <button
              onClick={onStart}
              className="w-full h-[44px] text-[#495057] hover:text-[#343A40] hover:underline transition-interactive focus-ring"
            >
              Usar sem registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}