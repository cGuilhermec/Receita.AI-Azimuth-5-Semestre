import { ChefHat } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
  onRegister: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onStart, onRegister, onLogin }: WelcomeScreenProps) {
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
              onClick={onLogin}
              variant="outline"
              className="w-full h-[44px] bg-white border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#F8F9FA] transition-interactive focus-ring"
            >
              Já tem conta? Entrar
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