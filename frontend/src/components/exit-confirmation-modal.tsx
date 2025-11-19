// components/exit-confirmation-modal.tsx
import { AlertTriangle, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function ExitConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  onLogin,
  onRegister,
}: ExitConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-[#343A40]">Receita Não Salva</h3>
            <p className="text-sm text-[#6C757D]">Modo Convidado</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-[#343A40] mb-3">
            Você está visualizando esta receita como convidado. Se voltar agora,
            poderá perder o acesso a esta receita.
          </p>
          <p className="text-sm text-[#6C757D]">
            Recomendamos criar uma conta para salvar permanentemente suas
            receitas.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={onLogin}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Fazer Login
            </Button>
            <Button
              onClick={onRegister}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF6B35]/90 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta
            </Button>
          </div>

          <div className="flex gap-3 pt-2 border-t border-border">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Continuar Vendo
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gray-500 hover:bg-gray-600"
            >
              Sair Mesmo Assim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
